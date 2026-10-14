'use client';

import Icon from "../site-icon";

import Link from 'next/link';
import { localApiAvailable, localApiUrl, newRequestId } from '../local-api';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './page.module.css';
import { assetPath } from '../assets';
import { sectors, type Sector } from '../business-sectors';

const emptyAnswers = { name: '', email: '', topic: 'General inquiry', message: '' };
const labels = { name: 'Full name', email: 'Email address', message: 'Your message' };
type RequiredField = keyof typeof labels;
type Errors = Partial<Record<RequiredField, string>>;

export default function ContactForm() {
  const [step, setStep] = useState(0);
  const [prepared, setPrepared] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(false);
  const [sector, setSector] = useState<Sector | null>(null);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<{ reference: number; test_mode: boolean } | null>(null);
  const summary = useRef<HTMLDivElement>(null);
  const success = useRef<HTMLHeadingElement>(null);
  const submission = useRef('');
  const submitting = useRef(false);

  useEffect(() => {
    const requestedSector = new URLSearchParams(location.search).get('sector');
    const matchedSector = sectors.find(item => item === requestedSector);
    if (matchedSector) {
      setSector(matchedSector);
      setAnswers({ ...emptyAnswers, topic: 'Member enterprises', message: `Hello WisConnect, I’d like to learn more about ${matchedSector.toLowerCase()} in your Chicago network. Could you help me find a business or make an introduction?` });
    }
    setAvailable(localApiAvailable());
    setReady(true);
  }, []);
  useEffect(() => { if (receipt) success.current?.focus(); }, [receipt]);
  useEffect(() => {
    if (!moveFocus.current) return;
    stepHeading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);

  function goToStep(next: number) {
    setErrors({}); setError(''); setPrepared(false); setCopyStatus('');
    moveFocus.current = true;
    setStep(next);
  }

  function updateAnswer(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    setAnswers(previous => ({ ...previous, [name]: value }));
    setErrors(previous => ({ ...previous, [name]: undefined }));
    setError('');
    submission.current = '';
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !ready) return;
    const nextErrors: Errors = {};
    const required: RequiredField[] = step === 0 ? ['name', 'email'] : step === 1 ? ['message'] : ['name', 'email', 'message'];
    for (const key of required) {
      if (!answers[key].trim()) nextErrors[key] = key === 'message'
        ? 'Tell us how we can help.' : key === 'name' ? 'Enter your name.' : 'Enter your email address.';
    }
    const email = event.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (required.includes('email') && answers.email.trim() && email.validity.typeMismatch) nextErrors.email = 'Enter an email address like name@example.com.';
    setErrors(nextErrors);
    setError('');
    if (Object.keys(nextErrors).length) {
      if (step === 2) setStep(nextErrors.name || nextErrors.email ? 0 : 1);
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    if (step < 2) { goToStep(step + 1); return; }
    if (!available) return;
    submitting.current = true;
    setBusy(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);
    try {
      submission.current ||= newRequestId();
      const response = await fetch(localApiUrl('/contact'), {
        method: 'POST', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
        headers: { 'Content-Type': 'application/json', 'X-WisConnect-Request': '1' },
        body: JSON.stringify({ ...answers, submission_id: submission.current }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(response.status === 404 || response.status >= 500
        ? 'Submissions are temporarily unavailable. Your answers are still here. Please try again, or email hello@wisconnect.co.'
        : typeof result.detail === 'string' ? result.detail : 'We couldn’t save your message. Please try again.');
      if (result.received !== true || typeof result.reference !== 'number') throw new Error('We couldn’t confirm receipt. Please try again.');
      setReceipt(result);
      setAnswers(emptyAnswers);
      submission.current = '';
    } catch (reason) {
      setError(reason instanceof Error && reason.name !== 'AbortError' && !(reason instanceof TypeError)
        ? reason.message : 'We couldn’t confirm receipt. Your answers are still here. Please try again, or email hello@wisconnect.co.');
    } finally {
      clearTimeout(timeout);
      submitting.current = false;
      setBusy(false);
    }
  }

  const invalidFields = (Object.keys(labels) as RequiredField[]).filter(key => errors[key]);
  const emailBody = `Name: ${answers.name.trim()}\nEmail: ${answers.email.trim()}\nTopic: ${answers.topic}\n\n${answers.message.trim()}`;
  const emailHref = `mailto:hello@wisconnect.co?subject=${encodeURIComponent(sector ? `Chicago sector inquiry: ${sector}` : `WisConnect inquiry: ${answers.topic}`)}&body=${encodeURIComponent(emailBody)}`;
  async function copyMessage() {
    try { await navigator.clipboard.writeText(emailBody); setCopyStatus('Copied. Paste into an email to hello@wisconnect.co.'); }
    catch { setCopyStatus('Copy is unavailable. Open the message text below to copy it.'); }
  }
  const fieldProps = (key: RequiredField) => ({
    id: 'contact-' + key, name: key, value: answers[key], onChange: updateAnswer, required: true,
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? 'contact-' + key + '-error' : undefined,
  });
  const errorText = (key: RequiredField) => errors[key] && <p className={styles.fieldError} id={'contact-' + key + '-error'}>{errors[key]}</p>;

  return <div className={styles.layout} data-step={receipt ? 'complete' : step}>
    {step === 0 && !receipt && <figure className={styles.photo}>
      <img src={assetPath('account-contact-cafe-640.webp')} srcSet={`${assetPath('account-contact-cafe-640.webp')} 640w, ${assetPath('account-contact-cafe-1200.webp')} 1200w`} sizes="(max-width: 959px) 1px, 466px" width="1200" height="800" alt="A woman with a laptop and phone beside a sunlit café window"/>
      <figcaption>Illustrative photography · RDNE Stock project / Pexels</figcaption>
    </figure>}
    <section className={styles.content} aria-labelledby="contact-title">
    {receipt ? <div className={styles.confirmation}>
      <span className={styles.confirmationIcon} aria-hidden="true"><Icon kind="check" size={28}/></span>
      <h1 id="contact-title" ref={success} tabIndex={-1}>Thanks for reaching out.</h1>
      <p>Your message has been received. The WisConnect team can follow up using the email you provided.</p>
      <p className={styles.receipt}>Reference #{receipt.reference}</p>
      {receipt.test_mode && <p className={styles.previewNote}>Saved in the local dashboard. Email notifications currently go to the test inbox.</p>}
      <Link className={styles.returnLink} href="/">Back to WisConnect <Icon kind="arrow"/></Link>
    </div> : <>
      <nav className={styles.progress} aria-label="Contact progress">
        <p><span>Contact WisConnect</span><span>Step {step + 1} of 3</span></p>
        <ol>{['Your details', 'Your message', 'Review'].map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined} data-complete={step > index}>{label}</li>)}</ol>
      </nav>
      <div className={styles.intro}>
        <h1 id="contact-title" ref={stepHeading} tabIndex={-1}>{['Let’s start a conversation.', 'What’s on your mind?', 'Review your message.'][step]}</h1>
        <p className={styles.lede}>{['First, let us know how to reach you.', 'Share your question, idea, or opportunity.', available ? 'Check your details before sending.' : 'Check your details, then send by email.'][step]}</p>
      </div>
      <form onSubmit={submit} noValidate aria-label="Contact WisConnect" aria-busy={busy}>
        {invalidFields.length > 0 && <div ref={summary} className={styles.errorSummary} role="alert" tabIndex={-1}>
          <p><strong>Check {invalidFields.length === 1 ? 'this detail' : 'these details'}.</strong></p>
          <ul>{invalidFields.map(key => <li key={key}><a href={'#contact-' + key} onClick={event => {
            event.preventDefault(); document.getElementById('contact-' + key)?.focus();
          }}>{labels[key]}: {errors[key]}</a></li>)}</ul>
        </div>}
        <fieldset className={styles.formFields} disabled={!ready || busy}>
          <legend className={styles.srOnly}>Your contact details and message</legend>
          <div hidden={step !== 0}>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="contact-name">Full name</label>
                <input {...fieldProps('name')} autoComplete="name" placeholder="e.g. Maya Johnson" maxLength={120}/>
                {errorText('name')}
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-email">Email address</label>
                <input {...fieldProps('email')} type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="e.g. maya@example.com" maxLength={254}/>
                {errorText('email')}
              </div>
            </div>
          </div>
          <div hidden={step !== 1}>
            {sector && <p className={styles.sectorNote}>Your inquiry about {sector.toLowerCase()} in Chicago is filled in below.</p>}
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="contact-topic">Topic</label>
                <div className={styles.selectControl}><select id="contact-topic" name="topic" value={answers.topic} onChange={updateAnswer}><option>General inquiry</option><option>Membership</option><option>Partnerships</option><option>Member enterprises</option></select><Icon kind="chevronDown" size={16}/></div>
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-message">Your message</label>
                <textarea {...fieldProps('message')} placeholder="How can we help?" rows={4} maxLength={3000}/>
                {errorText('message')}
                {answers.message.length >= 2700 && <span className={styles.characterCount}>{3000 - answers.message.length} characters remaining</span>}
              </div>
            </div>
          </div>
          {step === 2 && <div className={styles.review}>
            <div className={styles.reviewHeading}><h2>Your details</h2><button type="button" onClick={() => goToStep(0)}>Edit details</button></div>
            <p>{answers.name}<br/>{answers.email}</p>
            <div className={styles.reviewHeading}><h2>{answers.topic}</h2><button type="button" onClick={() => goToStep(1)}>Edit message</button></div>
            <p className={styles.reviewMessage}>{answers.message}</p>
          </div>}
          <div className={styles.formActions}>
            {step > 0 && <button type="button" className={styles.backAction} onClick={() => goToStep(step - 1)}><Icon kind="arrow" size={16}/>Back</button>}
            {step < 2 ? <button type="submit" className={styles.primaryAction}>{step === 0 ? 'Continue' : 'Review message'} <Icon kind="arrow" size={16}/></button>
              : available ? <button type="submit" className={styles.primaryAction}>{busy ? 'Sending…' : 'Send message'} <Icon kind="arrow" size={16}/></button>
              : <a className={styles.primaryAction} href={emailHref} onClick={() => setPrepared(true)}>Open email draft <Icon kind="arrow" size={16}/></a>}
          </div>
        </fieldset>
        {error && <p className={styles.submissionError} role="alert">{error}</p>}
        {step === 2 && !available && <div className={styles.emailFallback}>
          {prepared && <p role="status">If your email app opened, press Send there. Nothing has been submitted through this website.</p>}
          <button type="button" onClick={copyMessage}>Copy message</button>
          {copyStatus && <p role="status">{copyStatus}</p>}
          <details><summary>View message text</summary><label className={styles.srOnly} htmlFor="contact-email-text">Copy this into an email to hello@wisconnect.co</label><textarea id="contact-email-text" value={emailBody} readOnly rows={5}/></details>
        </div>}
        <p className={styles.privacyNote}>{available ? 'Your details are used to respond to your inquiry.' : 'Your answers stay in this tab until you send the email.'} <Link href="/terms">Terms & Conditions</Link></p>
      </form>
      <noscript><p>To contact us, email <a href="mailto:hello@wisconnect.co">hello@wisconnect.co</a>.</p></noscript>
    </>}
    </section>
  </div>;
}
