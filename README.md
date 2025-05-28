# Hugo Vitae

A professional resume and CV theme for Hugo that generates elegant, customizable resumes from structured YAML data.

![Hugo Vitae Theme](https://vitae.heimlicher.com/images/preview.png)

## Features

- **Multiple Templates** - Choose from different resume layouts such as a consulting resume, an executive with a dedicated front page, etc.
- **Print-Optimized** - Carefully designed for print output on one or several pages
- **Multilingual Support** - Currently supports English and German
- **Customizable Components** - Headers, skills, experience sections, publications and more
- **YAML-Driven** - Define your entire resume in structured data files

## Quick Start

1. Create a new Hugo site:

   ```bash
   hugo new site my-resume
   cd my-resume
   ```

2. Add the theme as a Hugo module:

   ```bash
   hugo mod init github.com/username/my-resume
   hugo mod get github.com/simonheimlicher/hugo-vitae
   ```

3. Configure your site to use the theme by adding to your `config/_default/hugo.yaml`:

   ```yaml
   theme: github.com/simonheimlicher/hugo-vitae
   ```

4. Create your resume data in `content/data/vitae/index.en.yaml` (see example below)

5. Preview your site:

   ```bash
   hugo server
   ```

## Configuration

### Basic Structure

The theme uses a combination of:

- Hugo configuration files
- YAML data files for your resume content
- Template parameters for styling and layout

### Example Data Structure

```yaml
personal:
  name: "Jane Doe"
  headline: "Senior Software Engineer"
  email: "jane@example.com"
  phone: "+1 (555) 123-4567"
  address: "San Francisco, CA"
  
profile:
  - title: "Summary"
    content: "Experienced software engineer with 10+ years developing scalable applications..."

skills:
  - name: "Programming"
    items: ["JavaScript", "Python", "Go", "Java"]
    level: 5
    type: "technical"
    
  - name: "English"
    level: 5
    type: "language"
    
stages:
  - organization: "Tech Company Inc."
    location: "San Francisco, CA"
    period: "2018-01 - Present"
    type: "professional"
    roles:
      - title: "Senior Software Engineer"
        period: "2020-01 - Present"
        achievements:
          title: Development
          content:
            - Led development of microservices architecture serving 1M+ users
            - Reduced system latency by 40% through optimization
          title: Software Architecture
          content:
            - Designed and implemented a scalable microservices architecture using Docker and Kubernetes
            - Established CI/CD pipelines reducing deployment time from days to minutes
            - Created comprehensive technical documentation and architecture diagrams for the engineering team
```

## Customization

### Templates

The theme offers multiple templates that can be configured in `config/_default/params.yaml`:

- **Executive** - Stylish layout for senior leaders with a summary on the first page
- **Resume** - Classical resume design

### Styling

Customize colors, fonts, and layouts through SCSS variables and Hugo parameters.

## Components

Hugo Vitae includes the following components:

- **Header** - Personal information with optional portrait
- **Skills** - Visual representation of skill levels
- **Experience** - Chronological work history with achievements
- **Education** - Academic background and qualifications
- **Publications** - Academic papers, professional publications and patents
- **Awards** - Recognition and achievements
- **Languages** - Language proficiency with optional level indicators

## Print Optimization

The theme is designed to generate print-ready PDFs:

- Proper page breaks
- Consistent typography
- Optimized for A4 paper sizes
- Configurable headers and footers
- Page numbering

## Advanced Features

- **Custom Sections** - Add specialized sections for your field
- **Multiple Resume Variants** - Create different versions, including one targeting *Applicant Tracking Systems (ATS)*
- **Localization** - Translate section titles and date formats
- **SEO Optimization** - Structured data for better search engine visibility

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Created by [Simon Heimlicher](https://simon.heimlicher.com)
- Built with [Hugo](https://gohugo.io/)
