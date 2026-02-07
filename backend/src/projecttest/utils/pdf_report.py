import json
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont


def generate_report(
    output_path,
    candidate_name,
    experience_level,
    selected_tech,
    interview_score,
    total_questions,
    coding_result,
    interview_feedback,
):

    """
    Generate recruiter-friendly PDF report.
    """

    # Font (supports lots of characters)
    pdfmetrics.registerFont(UnicodeCIDFont("HeiseiMin-W3"))

    doc = SimpleDocTemplate(output_path)
    styles = getSampleStyleSheet()
    style = styles["BodyText"]
    style.fontName = "HeiseiMin-W3"

    story = []

    # ================= HEADER =================
    story.append(Paragraph("<b>Candidate Interview Report</b>",styles['Heading2']))
    story.append(Spacer(1, 20))

    # ================= BASIC INFO =================
    story.append(Paragraph(f"<b>Candidate:</b> {candidate_name}", style))
    story.append(Paragraph(f"<b>Experience Level:</b> {experience_level}", style))
    story.append(Paragraph(f"<b>Technology:</b> {selected_tech}", style))
    story.append(Spacer(1, 20))

    # ================= INTERVIEW SCORE =================
    story.append(Paragraph("<b>Interview Result</b>",styles['Heading2']))
    story.append(
        Paragraph(f"Score: {interview_score} / {total_questions}", style)
    )
    story.append(Spacer(1, 20))
    # ================= INTERVIEW FEEDBACK =================
    story.append(Paragraph("<b>Interview Feedback</b>", styles['Heading2']))
    story.append(Spacer(1, 12))

    for line in interview_feedback.split("\n"):
        if line.strip():
            story.append(Paragraph(line, style))

    story.append(Spacer(1, 20))

    # ================= CODING RESULT =================
    story.append(Paragraph("<b>Coding Challenge Result</b>", styles['Heading2']))
    story.append(Spacer(1, 12))

    try:
        if isinstance(coding_result, str):
            coding_result = json.loads(coding_result)

        score = coding_result.get("score", "N/A")
        verdict = coding_result.get("verdict", "N/A")
        feedback = coding_result.get("feedback", "N/A")

        story.append(Paragraph(f"<b>Score:</b> {score}", styles['BodyText']))
        story.append(Paragraph(f"<b>Verdict:</b> {verdict}", styles['BodyText']))
        story.append(Spacer(1, 12))
        story.append(Paragraph(f"<b>Feedback:</b>", styles['BodyText']))
        story.append(Paragraph(feedback, styles['BodyText']))

    except Exception:
        story.append(Paragraph("Could not parse coding result.", styles['BodyText']))


    doc.build(story)
