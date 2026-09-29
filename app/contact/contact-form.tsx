'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './page.module.css';

const emptyAnswers = { name: '', email: '', topic: 'General inquiry', message: '' };
const labels = { name: 'Full name', email: 'Email address', message: 'Your message' };
type RequiredField = keyof typeof labels;
type Errors = Partial<Record<RequiredField, string>>;

export default function ContactForm() {
  const [answers, setAnswers] = useState(emptyAnswers);
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<{ reference: number; test_mode: boolean } | null>(null);
  const summary = useRef<HTMLDivElement>(null);
  const success = useRef<HTMLHeadingElement>(null);
  const submission = useRef('');
  const submitting = useRef(false);

  useEffect(() => {
    setAvailable(location.origin === 'http://localhost:3000' && !process.env.NEXT_PUBLIC_BASE_PATH);
    setReady(true);
  }, []);
  useEffect(() => { if (receipt) success.current?.focus(); }, [receipt]);

  function updateAnswer(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    setAnswers(previous => ({ ...previous, [name]: value }));
    setErrors(previous => ({ ...previous, [name]: undefined }));
    setError('');
    submission.current = '';
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !available) return;
    const nextErrors: Errors = {};
    for (const key of Object.keys(labels) as RequiredField[]) {
      if (!answers[key].trim()) nextErrors[key] = key === 'message'
        ? 'Tell us how we can help.' : key === 'name' ? 'Enter your name.' : 'Enter your email address.';
    }
    const email = event.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (answers.email.trim() && email.validity.typeMismatch) nextErrors.email = 'Enter an email address like name@example.com.';
    setErrors(nextErrors);
    setError('');
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    submitting.current = true;
    setBusy(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);
    try {
      submission.current ||= crypto.randomUUID();
      const response = await fetch('http://localhost:8001/contact', {
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
  const fieldProps = (key: RequiredField) => ({
    id: 'contact-' + key, name: key, value: answers[key], onChange: updateAnswer, required: true,
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? 'contact-' + key + '-error' : undefined,
  });
  const errorText = (key: RequiredField) => errors[key] && <p className={styles.fieldError} id={'contact-' + key + '-error'}>{errors[key]}</p>;

  return <section className={styles.card} aria-labelledby="contact-form-title">
    {receipt ? <div className={styles.confirmation}>
      <span className={styles.confirmationIcon} aria-hidden="true">✓</span>
      <h2 id="contact-form-title" ref={success} tabIndex={-1}>Thanks for reaching out.</h2>
      <p>Your message has been received. The WisConnect team can follow up using the email you provided.</p>
      <p className={styles.receipt}>Reference #{receipt.reference}</p>
      {receipt.test_mode && <p className={styles.previewNote}>Saved in the local dashboard. Email notifications currently go to the test inbox.</p>}
      <Link className={styles.returnLink} href="/">Back to WisConnect <span aria-hidden="true">→</span></Link>
    </div> : <>
      <div className={styles.formHeading}><h2 id="contact-form-title">Send us a message.</h2></div>
      {ready && !available && <p className={styles.unavailable} role="status">Online submissions aren’t available here yet. Please email <a href="mailto:hello@wisconnect.co">hello@wisconnect.co</a>.</p>}
      <form onSubmit={submit} noValidate aria-label="Contact WisConnect" aria-busy={busy}>
        {invalidFields.length > 0 && <div ref={summary} className={styles.errorSummary} role="alert" tabIndex={-1}>
          <p><strong>Check {invalidFields.length === 1 ? 'this detail' : 'these details'}.</strong></p>
          <ul>{invalidFields.map(key => <li key={key}><a href={'#contact-' + key} onClick={event => {
            event.preventDefault(); document.getElementById('contact-' + key)?.focus();
          }}>{labels[key]}: {errors[key]}</a></li>)}</ul>
        </div>}
        <fieldset className={styles.formFields} disabled={!ready || !available || busy}>
          <legend className={styles.srOnly}>Your contact details and message</legend>
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
            <div className={styles.field}>
              <label htmlFor="contact-topic">Topic</label>
              <select id="contact-topic" name="topic" value={answers.topic} onChange={updateAnswer}><option>General inquiry</option><option>Membership</option><option>Partnerships</option><option>Member enterprises</option></select>
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-message">Your message</label>
              <textarea {...fieldProps('message')} placeholder="e.g. I’d love to learn more about WisConnect and how to get involved." rows={5} maxLength={3000}/>
              {errorText('message')}
              {answers.message.length >= 2700 && <span className={styles.characterCount}>{3000 - answers.message.length} characters remaining</span>}
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryAction}>{busy ? 'Submitting…' : 'Submit'} <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          </div>
        </fieldset>
        {error && <p className={styles.submissionError} role="alert">{error}</p>}
        <p className={styles.privacyNote}>We’ll use your details to respond to your inquiry. <Link href="/terms">Terms & Conditions</Link></p>
      </form>
      <noscript><p>To contact us, email <a href="mailto:hello@wisconnect.co">hello@wisconnect.co</a>.</p></noscript>
    </>}
  </section>;
}
