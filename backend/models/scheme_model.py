from datetime import datetime
import requests
import os
from dotenv import load_dotenv

load_dotenv()

class SubsidyScheme:
    def __init__(self, scheme_id, title, description, deadline, eligibility, benefits, application_url, category, state):
        self.scheme_id = scheme_id
        self.title = title
        self.description = description
        self.deadline = deadline
        self.eligibility = eligibility
        self.benefits = benefits
        self.application_url = application_url
        self.category = category
        self.state = state
        self.last_updated = datetime.now()

    def to_dict(self):
        return {
            'scheme_id': self.scheme_id,
            'title': self.title,
            'description': self.description,
            'deadline': self.deadline.strftime('%Y-%m-%d') if isinstance(self.deadline, datetime) else self.deadline,
            'eligibility': self.eligibility,
            'benefits': self.benefits,
            'application_url': self.application_url,
            'category': self.category,
            'state': self.state,
            'last_updated': self.last_updated.strftime('%Y-%m-%d %H:%M:%S')
        }

def fetch_govt_schemes():
    """
    Fetches real-time agricultural schemes from government APIs.
    Currently supports:
    - PM-KISAN
    - National Agriculture Market (eNAM)
    - Pradhan Mantri Fasal Bima Yojana (PMFBY)
    - Kisan Credit Card (KCC)
    """
    # API endpoints (replace with actual government API endpoints when available)
    AGRI_SCHEME_API = os.getenv('AGRI_SCHEME_API', 'https://api.data.gov.in/agriculture/schemes')
    API_KEY = os.getenv('GOVT_API_KEY')

    try:
        # Fallback data in case API is not available
        default_schemes = [
            SubsidyScheme(
                scheme_id="PMKISAN2025",
                title="PM-KISAN",
                description="Direct income support of Rs. 6000 per year to farmer families",
                deadline="2025-12-31",
                eligibility="Small and Marginal Farmers with less than 2 hectares",
                benefits="Rs. 6000 per year in three installments",
                application_url="https://pmkisan.gov.in/",
                category="Direct Benefit Transfer",
                state="All India"
            ),
            SubsidyScheme(
                scheme_id="PMFBY2025",
                title="Pradhan Mantri Fasal Bima Yojana",
                description="Crop insurance scheme to protect against natural calamities",
                deadline="Based on crop season",
                eligibility="All farmers including sharecroppers",
                benefits="Insurance coverage and financial support",
                application_url="https://pmfby.gov.in/",
                category="Insurance",
                state="All India"
            ),
            SubsidyScheme(
                scheme_id="KCC2025",
                title="Kisan Credit Card",
                description="Credit facility for farmers with flexible repayment options",
                deadline="Ongoing",
                eligibility="All farmers, sharecroppers, and rural entrepreneurs",
                benefits="Credit up to Rs. 3 lakhs at 4% interest rate",
                application_url="https://www.india.gov.in/spotlight/kisan-credit-card",
                category="Credit",
                state="All India"
            )
        ]

        if not API_KEY:
            return default_schemes

        # Attempt to fetch real-time data
        response = requests.get(
            AGRI_SCHEME_API,
            headers={'Authorization': f'Bearer {API_KEY}'},
            timeout=10
        )

        if response.status_code == 200:
            schemes_data = response.json()
            # Parse and convert API response to SubsidyScheme objects
            # Implementation depends on actual API response structure
            return [SubsidyScheme(**scheme) for scheme in schemes_data]
        
        return default_schemes

    except Exception as e:
        print(f"Error fetching schemes: {str(e)}")
        return default_schemes

def get_eligible_schemes(farmer_profile):
    """
    Returns schemes that match the farmer's profile based on:
    - Location (state)
    - Land holding size
    - Crop types
    - Previous scheme participation
    """
    all_schemes = fetch_govt_schemes()
    eligible_schemes = []

    for scheme in all_schemes:
        # Basic eligibility check - expand based on actual requirements
        if scheme.state in ["All India", farmer_profile.get('state')]:
            # Add more specific eligibility checks here
            eligible_schemes.append(scheme)

    return eligible_schemes

def get_scheme_updates(last_check_time):
    """
    Returns new or updated schemes since last check
    """
    all_schemes = fetch_govt_schemes()
    return [
        scheme for scheme in all_schemes
        if scheme.last_updated > last_check_time
    ]