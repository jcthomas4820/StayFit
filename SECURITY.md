# Security Analysis

Describe the security considerations you will take when building your app in this file. This should
include both a threat assessment and a planned defense strategy.

Resource used to determine the types of risk and their preventions needed for our app: OWASP Top Ten Web Application Security Risks, https://owasp.org/www-project-top-ten/

#Things an attacker might do 
1. Inject hostile data into the interpreter to make changes to the app, delete, corrupt user information, display wrong information to the user, and misguide the user by miscalculating their dietary needs and goals. 
2. Detecting broken authentication in our app using manual means and exploiting them using automated tools with password lists and dictionary attacks to gain access to user passwords, keys, or session tokens, which could lead to temporary or permanent identity theft. 
3. Monitor network traffic (e.g. at an insecure wireless network), downgrade connections from HTTPS to HTTP, intercept requests, and steal the user’s session cookie. Then replay this cookie and hijack the user’s session, accessing or modifying the user’s private data such as their health information, personal information, etc. 
4. Exploit known vulnerabilities in components to execute arbitrary code on the server.

#Injection Prevention
1. We will validate, filter/sanitize any user supplied data in our system by using APIs which avoid the use of the interpreter entirely or provides a parameterized interface.
2. We will not use Dynamic queries or non-parameterized calls without context-aware escaping directly in the interpreter. For any residual dynamic queries, escape special characters using the specific escape syntax for that interpreter. 
3. We will use positive or "whitelist" server-side input validation. 
4. We will use LIMIT and other SQL controls within queries to prevent mass disclosure of records in case of SQL injection.
5. We will review our source code thoroughly and do automated testing of all parameters, headers, URL, cookies, JSON, SOAP, and XML data inputs by including the static source (SAST) and dynamic application test (DAST) tools into the CI/CD pipeline to identify newly introduced injection flaws prior to production deployment. 

#Sensitive Data Exposure Prevention
1. We will not store sensitive data unnecessarily by discarding it as soon as possible.
2. We will encrypt all sensitive data at rest.
3. We will ensure that up-to-date and strong standard algorithms, protocols, and keys are in place. 
4. We will disable caching for response that contain sensitive data


#Broken Authentication Prevention
We will prevent broken authentication by
1. Implementing multi-factor authentication to prevent automated, credential stuffing, brute force, and stolen credential reuse attacks
2. Implement weak-password checks such as testing new or changed passwords. 
3. Ensure registration, credential recovery, and API pathways are hardened against account enumeration attacks by using the same messages for all outcomes. 
4. Limit or increasingly delay failed login attempts. 
5. Use a server-side, secure, built-in session manager that generates a new random session ID with high entropy after login. Session IDs should not be in the URL, be securely stored and invalidated after logout, idle, and absolute timeouts.

#Prevent using components with unknown vulnerabilities by
1. Removing unused dependencies, unnecessary features, components, files, and documentation.
2. Only obtaining components from official sources over secure links. Using signed packages to reduce the chance of including a modified, malicious components. 
