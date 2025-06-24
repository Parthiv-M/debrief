# debrief

[*Debriefing*, as per Wikipedia](https://en.wikipedia.org/wiki/Debriefing)

---

An OpenAI powered Google Chrome extension that briefs you about your search results, right on your search results page.

There is a FastAPI server that does the heavy lifting in terms of making the API calls, handling the scraping of metadata and other processes required to provide the information required by the extension. The extension itself is written in Typescript and built using
a custom webpack configuration.

## Local setup

If you want to set this project up locally, the following instructions can help you:

### Server
- Create a virtual environment for the project by running

  ```python
  python3 -m venv venv
  ```

- Activate the environment using `source <environment-name>/bin/activate`

- Install the required packages using the `requirements.txt` file by running the command `pip install -r requirements.txt`
- At this point, running `uvicorn --reload app:app` should start the FastAPI server on your system on port `8000`
- Navigate to `http://localhost:8000/` on your browser and you should be able to see a message that says `API is functional`

### Extension

It is fairly straightforward to get this extension installed on your browser.
- Navigate to the `extension/` directory and install all dependencies using `npm ci`
  - It is recommended to use the Node version as specified in the `.nvmrc` file
- Create a production build of the extension by running `npm run build`
- This will create a `dist/` directory that can then be used to use and/or test the extension locally

## Let me know

Feel free to [get in touch](mailto:parthivmenon.dev@gmail.com) with me with any opinions and/or suggestions!