import glob
import re
import os

# Update Navigation in all HTML files
files = glob.glob("*.html")
for f in files:
    if f in ["insights_footer.html"]: continue
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Add Insights to nav links if not present
    if "insights.html" not in content and "nav-links" in content:
        # For Desktop Nav
        content = re.sub(
            r"(<li><a href=\"events\.html\">Events</a></li>)",
            r"\1\n                <li><a href=\"insights.html\">Insights</a></li>",
            content
        )
        # For Mobile Nav
        content = re.sub(
            r"(<li><a href=\"events\.html\" onclick=\"closeMobileMenu\(\)\">Events</a></li>)",
            r"\1\n            <li><a href=\"insights.html\" onclick=\"closeMobileMenu()\">Insights</a></li>",
            content
        )
        with open(f, "w", encoding="utf-8") as file:
            file.write(content)

# Assemble Insights Page
try:
    with open("insights.html", "r", encoding="utf-8") as file:
        header = file.read()
    with open("insights_footer.html", "r", encoding="utf-8") as file:
        footer = file.read()
        
    # Replace title and active link
    header = re.sub(r"<title>.*?</title>", "<title>Investment Insights — Oval Palace Resort | Nalakath Holdings</title>", header)
    header = re.sub(r"<li><a href=\"about\.html\" class=\"active\">About</a></li>", "<li><a href=\"about.html\">About</a></li>", header)
    header = re.sub(r"<li><a href=\"insights\.html\">Insights</a></li>", "<li><a href=\"insights.html\" class=\"active\">Insights</a></li>", header)

    # Blog Content
    blog_content = """
    <!-- ==================== PAGE HEADER ==================== -->
    <header class="page-header reveal" style="padding-top: 150px; padding-bottom: 50px; text-align: center;">
        <div class="container">
            <span class="section-label" style="justify-content: center;">Market Research & Articles</span>
            <h1 class="section-title">Investment <span class="gold-gradient-text">Insights</span></h1>
            <p class="section-subtitle" style="margin: 0 auto;">Expert analysis on hospitality equity and high-yield asset growth in Kerala.</p>
        </div>
    </header>

    <!-- ==================== INSIGHTS SECTION ==================== -->
    <section class="insights" style="padding: 50px 0; background: var(--bg-primary);">
        <div class="container">
            <div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 40px;">
                
                <!-- Article 1 -->
                <article class="blog-card reveal" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; transition: transform 0.3s ease;">
                    <img src="images/hero-4.jpg" alt="Kerala Hospitality Investment" style="width: 100%; height: 250px; object-fit: cover;">
                    <div style="padding: 30px;">
                        <span style="color: var(--gold); font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Market Analysis</span>
                        <h3 style="margin: 15px 0; font-size: 1.5rem; color: var(--text-primary); font-family: Playfair Display, serif;">Why Premium Hospitality is Kerala's Most Secure Asset Class for 2026</h3>
                        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">Discover how High Net Worth Individuals are securing their wealth against inflation by pivoting from traditional real estate to preferred equity in luxury resorts.</p>
                        <a href="#investment" style="color: var(--gold); text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">Read Full Report <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i></a>
                    </div>
                </article>

                <!-- Article 2 -->
                <article class="blog-card reveal" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; transition: transform 0.3s ease;">
                    <img src="images/hero-1.jpg" alt="Oval Palace Development" style="width: 100%; height: 250px; object-fit: cover;">
                    <div style="padding: 30px;">
                        <span style="color: var(--gold); font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Project Updates</span>
                        <h3 style="margin: 15px 0; font-size: 1.5rem; color: var(--text-primary); font-family: Playfair Display, serif;">The Rise of Oval Palace: Strategic Growth in Perinthalmanna</h3>
                        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">An inside look at Nalakath Holdings' landmark project, its socio-economic impact in Malappuram, and the strategic advantages of its geographic positioning.</p>
                        <a href="#investment" style="color: var(--gold); text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">Read Full Report <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i></a>
                    </div>
                </article>

            </div>
        </div>
    </section>
    """

    # Assemble and write the full page
    with open("insights.html", "w", encoding="utf-8") as file:
        file.write(header + blog_content + footer)
    
    # Cleanup temporary footer
    os.remove("insights_footer.html")
    print("insights.html created successfully and nav links updated!")

except Exception as e:
    print(f"Error: {e}")
