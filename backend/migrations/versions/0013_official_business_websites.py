"""Link Momentum Coffee and BDavis Designs to their official websites."""
from alembic import op
import sqlalchemy as sa

revision = "0013_official_business_websites"
down_revision = "0012_ilava_business"
branch_labels = None
depends_on = None


WEBSITES = {
    "bdavis": "https://www.bdavis-designs.com/",
    "momentum": "https://momentumcoffee.org/",
}


def _set_websites(values):
    connection = op.get_bind()
    for slug, website in values.items():
        connection.execute(sa.text("""
            UPDATE businesses
            SET draft = jsonb_set(draft, '{website}', to_jsonb(CAST(:website AS text)), true),
                published = jsonb_set(published, '{website}', to_jsonb(CAST(:website AS text)), true),
                updated_at = now()
            WHERE slug = :slug
        """), {"slug": slug, "website": website})


def upgrade():
    _set_websites(WEBSITES)


def downgrade():
    _set_websites({slug: "" for slug in WEBSITES})
