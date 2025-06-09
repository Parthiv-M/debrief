import re
import requests
from bs4 import BeautifulSoup
from langchain_openai import OpenAI

from utils import clean_text

class SiteToDebrief:
    def __init__(self, url: str):
        self.__site_url = url
        response = self.__get_response_from_url()
        if response.status_code == 200:
            self.__site_html = response.text
        else:
            self.__site_html = None
        self.__site_colors = None
        self.__site_summary = ''

    def __get_response_from_url(self):
        response = requests.get(self.__site_url)
        # TODO: add error handling
        return response

    def __get_soup_from_html(self):
        return BeautifulSoup(self.__site_html, 'html.parser')

    def __extract_metadata_from_url(self):
        # Parse the HTML content
        soup = self.__get_soup_from_html()

        # Extract the title
        title = soup.title.string if soup.title else 'No title found'

        # Extract meta tags
        meta_tags = soup.find_all('meta')
        metadata = {
            'title': title,
            'description': None,
            'keywords': None,
        }

        for meta in meta_tags:
            if 'name' in meta.attrs:
                if meta['name'].lower() == 'description':
                    metadata['description'] = meta.get('content', 'No description found')
                elif meta['name'].lower() == 'keywords':
                    metadata['keywords'] = meta.get('content', 'No keywords found')

        self.__site_title = metadata['title']
        self.__site_description = metadata['description']

    def __extract_colors_from_url(self):
        soup = self.__get_soup_from_html()
        styles = soup.find_all('style')
        css_colors = []

        # Extract colors from style tags
        for style in styles:
            css_colors.extend(re.findall(r'#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgba?$\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*\d?\.?\d+)?$', style.string))

        # Get all inline styles
        inline_styles = soup.find_all(style=True)
        for element in inline_styles:
            css_colors.extend(re.findall(r'#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgba?$\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*\d?\.?\d+)?$', element['style']))

        # Get colors from CSS classes (if any)
        for link in soup.find_all('link', rel='stylesheet'):
            css_url = link['href']
            if not css_url.startswith('http'):
                css_url = self.__site_url + css_url  # Handle relative URLs
            css_response = requests.get(css_url)
            if css_response.status_code == 200:
                css_colors.extend(re.findall(r'#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgba?$\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*\d?\.?\d+)?$', css_response.text))

        # Remove duplicates and return unique colors
        unique_colors = set(css_colors)
        self.__site_colors = unique_colors

    def __summarize_from_url(self):
        llm = OpenAI()
        context = f"""
            Summarize the webpage given at the end of the prompt in 
            100 words while mentioning the following details:
            
            1. What is the aim of the website?
            2. What are the different sections of the website?
            3. What type of website is it: company, fashion, personal, marketing,
            academic, product, professional, e-commerce, catalogue or something else?
            
            Do not give sentences that feel like you are directly stating 
            the contents from the webpage. Make it a high level summary.

            {self.__site_url}
        """
        prompt = f"{context}"
        answer = llm.invoke(prompt)
        self.__site_summary = clean_text(answer)

    def get_site_data(self) -> dict:
        self.__extract_metadata_from_url()
        self.__extract_colors_from_url()
        self.__summarize_from_url()
        return {
            "site_title": self.__site_title,
            "site_description": self.__site_description, 
            "site_url": self.__site_url,
            "site_colors": self.__site_colors,
            "site_summary": self.__site_summary
        }
