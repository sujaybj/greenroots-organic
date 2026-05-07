<!-- GitHub issue template for security vulnerabilities -->
name: Security Vulnerability Report
description: Report a security vulnerability responsibly
title: "[SECURITY] "
labels: ["security", "bug"]

body:
  - type: markdown
    attributes:
      value: |
        Thank you for responsibly reporting a security vulnerability!
        
        **IMPORTANT**: Please do NOT create a public GitHub issue for security vulnerabilities.
        
        Instead:
        1. Email us at [security@organicapp.dev](mailto:security@organicapp.dev) with details
        2. Or use GitHub's Private Vulnerability Reporting feature
        
        This form is for **non-security bug reports only**.

  - type: textarea
    attributes:
      label: Vulnerability Description
      description: Describe the security issue in detail
      placeholder: |
        Example: SQL injection vulnerability in user search endpoint
    validations:
      required: true

  - type: textarea
    attributes:
      label: Steps to Reproduce
      description: Detailed steps to reproduce the vulnerability
      placeholder: |
        1. Go to...
        2. Send request with...
        3. Observe...

  - type: textarea
    attributes:
      label: Impact
      description: What is the potential impact of this vulnerability?
      placeholder: |
        This could allow an attacker to...

  - type: input
    attributes:
      label: Affected Version
      description: Which version(s) are affected?
      placeholder: "e.g., 1.0.0"
    validations:
      required: true

  - type: textarea
    attributes:
      label: Proof of Concept (Optional)
      description: Minimal code/request to demonstrate the issue
      render: bash
