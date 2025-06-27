## Marketplace - Complete User Stories

### 1. User Registration

ID: US-001
Title: User Account Setup
As a: New user
I want: To register with an email and password
So that: I can create an account on the platform

Acceptance Criteria:

1. Given a user is on the registration page\
   When they enter:\
   - first name
   - last name
   - a valid email (proper format: name@domain.com)
   - password (minimum 8 characters with at least one uppercase letter, one lowercase letter, and one special character, not one of the common passwords - https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10-million-password-list-top-1000000.txt)
   - confirm password
   - country of residence out of ISO 3166-1 alpha-2 countries into a combobox
     Then they can submit the registration form
2. Given a user submits the registration form with valid information\
   When the system processes the submission\
   Then the system creates a new user account in the database with hashed password (using bcrypt algorithm), displays a success message as a green toast at the bottom right of the page stating "Registration successful! Please check your email to verify your account", and sends a verification email to the user
3. Given a user submits the registration form with passwords that don't match\
   When the system processes the submission\
   Then the system displays an error message as red text directly beneath the password field stating "Passwords do not match"
4. Given the system attempts to send a verification email\
   When the email service is unavailable or fails\
   Then the system displays a message stating "We couldn't send a verification email at this time. Please try again later" as a red toast at the bottom right of the page
5. Given a user's verification code expires (after 24 hours)\
   When they submit expired code\
   Then they are shown a page explaining the link has expired with a button to "Resend verification email"

Priority: High
Story Points: 5

### 2. User Authentication

ID: US-002
Title: Secure User Login
As a: Registered user
I want: To securely log in to my account
So that: I can access my personal dashboard and platform features

Acceptance Criteria:

1. Given a user navigates to the login page\
   When they enter their registered email and password\
   Then the system validates their credentials against the database (using argon2 to verify password hash) and grants access to their account
2. Given a user attempts to log in with incorrect credentials\
   When they submit the login form\
   Then the system displays a generic error message as a red toast notification stating "Invalid email or password" without specifying which field is incorrect for security reasons, and logs the failed attempt with IP address and timestamp
3. Given a user has forgotten their password\
   When they click the "Forgot Password" link on the login page\
   Then they are directed to a password reset form where they can enter their email address to receive a time-limited reset link (valid for 1 hour)
4. Given a user successfully logs in\
   When the system authenticates their credentials\
   Then the system generates a JWT token and stores it securely in an HttpOnly cookie with secure and SameSite attributes
5. Given a user has been inactive for the token expiration period\
   When they attempt to access a protected resource\
   Then the system redirects them to the login page with a message stating "Your session has expired. Please log in again"

Priority: High
Story Points: 5

### 3. Listing & Services

ID: US-003
Title: Sell Digital Assets and Services
As a: Seller (Verified user)
I want: To list my services or digital assets with descriptions and pricing
So that: Buyers can discover and purchase them

Acceptance Criteria:

1. Given a verified user is on the "Create Listing" page\
    When they attempt to complete the listing form\
   Then they see all required fields clearly marked with an asterisk (\*): title (3-100 characters), category (selected from predefined combobox), description (50-5000 characters), pricing (positive number), and at least one image
2. Given a seller submits a listing with all required information\
   When the system processes the submission\
   Then the listing is published and appears in search results, and the seller receives a confirmation message as a green toast notification at the bottom right stating "Your listing has been published successfully"
3. Given a seller attempts to upload listing images\
   When the images exceed the maximum allowed size (5MB per image) or use an unsupported format (only JPG, PNG)\
   Then the system displays an error message in red text beneath the image upload area specifying "Images must be JPG, or PNG format and less than 5MB in size" and prevents submission until resolved
4. Given a seller wants to update an existing listing\
   When they navigate to "My Listings" section (accessible from the account dropdown menu) and select "Edit" on a specific listing\
   Then they can modify any field, and upon submission, the system updates the listing in the database with a timestamp indicating "Last Updated: [date/time]"
5. Given a seller wants to remove a listing\
   When they select "Delete" option on their listing\
   Then the system displays a confirmation modal dialog with the text "Are you sure you want to delete this listing? This action cannot be undone.", and upon clicking "Delete", removes the listing from public view
6. Given a seller submits a listing with incomplete required fields\
   When they attempt to submit the form\
   Then client-side validation prevents submission, the form highlights all missing or invalid fields in red

Priority: High
Story Points: 5

### 4. User Profile Management

ID: US-004
Title: Manage Your Profile
As a: User
I want: To manage my profile information
So that: I can update my details and preferences

Acceptance Criteria:

1. Given a user is logged in and navigates to the profile edit page (accessible from profile page)\
   When they view their profile\
   Then they can see all their current information including first name, last name, email, profile picture
2. Given a user is editing their profile\
   When they upload a new profile picture (JPG, PNG, max 2MB)\
   Then the system displays a preview of the image before saving and updates the profile upon clicking the "Save Changes" button
3. Given a user attempts to upload a profile picture exceeding size limits or in wrong format\
   When they select the file\
   Then the system displays an error message below the upload area stating "Please use JPG, or PNG format images under 2MB" and maintains the current profile picture
4. Given a user wants to change their password\
   When they enter their current password correctly, followed by a new password and confirmation (meeting the same security requirements as registration)\
   Then the system updates their password using the same secure hashing algorithm and sends an email notification about the password change to their registered email
5. Given a user enters incorrect current password when attempting to change password\
   When they submit the form\
   Then the system displays an error message beneath the current password field stating "Current password is incorrect" without revealing any password criteria
6. Given any profile changes are saved successfully\
   When the update completes\
   Then the system displays a success message specific to the changed field(s) (e.g., "Your profile picture has been updated") as a green toast notification at the bottom right
7. Given a user has no profile picture uploaded\
   When they view their profile\
   Then the system displays a default avatar with their initials and an "Upload Picture" button

Priority: Medium
Story Points: 3

### 5. Searching and Filtering Listings

ID: US-005
Title: Discover Services and Assets
As a: Buyer
I want: To search and filter listings
So that: I can easily find the services or assets that match my needs

Acceptance Criteria:

1. Given a user is on the marketplace homepage\
   When they enter keywords in the search bar\
   Then the system displays results matching the keywords, with the most relevant results appearing first based on keyword matching in title, and category
2. Given a search returns more than 20 results\
   When the page loads\
   Then results are paginated with 20 items per page, with clear pagination controls showing current page and total pages at the bottom of the results
3. Given a user has performed a search\
   When they apply filters from the left sidebar (category, price range with min/max inputs, seller rating with star selection, date added with date picker)\
   Then the URL updates with query parameters reflecting the current filters
4. Given a user performs a search that yields no results\
   When the search completes\
   Then the system displays a message in the center of the results area stating "No listings found matching your criteria" along with 3 suggestions for broadening the search (e.g., "Try using fewer keywords", "Remove some filters", "Check for typos")
5. Given a user finds a listing they're interested in\
   When they click the "Save" or Bookmark icon\
   Then the listing is added to their saved items, the icon changes state visually (from outline to filled), and they can access it later from their "Bookmarks" section in their account dashboard
6. Given a user has applied multiple filters\
   When they click "Clear All Filters" button in the filter sidebar\
   Then all filter selections are reset to their defaults while maintaining the original search term, and results update
7. Given a mobile user is viewing search results\
   When they want to access filters\
   Then filters are accessible via a "Filters" button that opens a sliding drawer from the bottom of the screen

Priority: High
Story Points: 4

### 6. Secure Payment Processing

ID: US-006
Title: Payment Processing
As a: Buyer
I want: To securely process payments through the platform and the crypto Payment Gateway
So that: I feel secure when making transactions

Acceptance Criteria:

1. Given a buyer has selected a service or and proceeds to checkout by clicking "pay with solana" or "Pay with card" buttons\
   When they reach the payment page\
   Then they are presented with a clear breakdown of the purchase amount, platform fees (if any), and total
2. Given a buyer selects credit/debit card payment\
   When they enter valid card details in the Stripe Elements form (properly formatted card number, expiration date, and CVV)\
   Then the system processes the payment via Stripe's secure API, and does not store complete card details in the platform's database
3. Given a buyer attempts a solana payment\
   When the payment is declined\
   Then the system displays a specific error message in a red notification box based on the decline reason (e.g., "Insufficient funds", "Wrong wallet password", etc.) without storing sensitive information, and allows the user to try again or select a different payment method
4. Given a buyer completes a payment successfully (via any method)\
   When the transaction is confirmed by the payment processor\
   Then both buyer and seller receive email and in-app notifications, including a unique transaction ID, amount, item details, and timestamp, and the buyer is redirected to an order confirmation page
5. Given a buyer attempts to make a payment while the payment system is experiencing technical issues\
   When they click "Pay Now"\
   Then the system provides a specific error message if possible, or a general message stating "We're currently experiencing technical difficulties with our payment system. Please try again later." with a "Try Again" button

Priority: High
Story Points: 6

### 7. Order Completion & Delivery

ID: US-007
Title: Order Delivery System
As a: Seller
I want: To complete and deliver orders through the platform
So that: Buyers receive their purchases efficiently

Acceptance Criteria:

1. Given a seller has received a new order\
   When they access their dashboard (via the "Seller Dashboard" link in the account menu)\
   Then they see the new order with status "In Progress" highlighted at the top of their orders list including order ID, buyer username, purchase date/time, and amount
2. Given a seller wants to deliver a digital product\
   When they navigate to the order details page by clicking on the specific order\
   Then they can upload the deliverable files (up to 1GB total size, supporting .zip, .pdf, .jpg, .png and other common formats) or provide access links in a dedicated text field
3. Given a seller attempts to upload a file exceeding the size limit or in an unsupported format\
   When they select the file\
   Then the system prevents the upload and displays an error message directly beneath the upload area specifying "Files must be under 1GB and in a supported format" with a list of supported formats
4. Given a seller has uploaded deliverable files or provided access information\
   When they click "Mark as Delivered" button\
   Then the system updates the order status to "Delivered" in the database, notifies the buyer via email and in-app notification, and starts the review period countdown (3 days) displayed as "Buyer review period: X days remaining" visible to the potential reviewer
5. Given a buyer receives a delivered order\
   When they access the order details from their "Orders" section\
   Then they can download the delivered files, and have clearly labeled buttons to either "Accept Delivery" or "Request Revision" with explanatory text for each option shown in a dialog upon clicking each button
6. Given a buyer accepts the delivery by clicking "Accept Delivery"\
   When they confirm this action in a verification modal\
   Then the system changes the order status to "Completed," and prompts the buyer to leave a review with a modal dialog containing a 5-star rating system and title and description field
7. Given a buyer requests a revision\
   When they click "Request Revision" and submit the request with specific details\
   Then the system notifies the seller via email and changes the order status to "Revision Requested" (visible to both parties), and extends the delivery deadline by 48 hours
8. Given an order is not delivered by the deadline\
   When the deadline passes (checked daily)\
   Then the system automatically flags the order as "Late" with a visual indicator in both buyer and seller dashboards, and gives the buyer the option via prominently displayed buttons to "Cancel Order"

Priority: High
Story Points: 5

### 8. Reviews & Ratings

ID: US-008
Title: Trust-Based Review System
As a: User
I want: To leave and read reviews after a transaction
So that: I can make informed decisions based on past experiences

Acceptance Criteria:

1. Given a buyer has accepted a delivery and the order is marked "Completed"\
   When they navigate to the orders page\
   Then they are prompted to leave a review with a 1-5 star rating system (displayed as interactive star icons that highlight on hover) and a text field title and description of their experience
2. Given a buyer attempts to submit a review without selecting a star rating or with insufficient text\
   When they click "Submit Review"\
   Then the form displays validation errors beneath the relevant fields stating "Please select a rating" and/or "Please provide more details (minimum 10 characters)" and prevents submission
3. Given a buyer submits a valid review\
   When the system processes the submission\
   Then the review is stored in the database with a blockchain transaction reference for verification, displayed on the seller's profile, and includes the reviewer's username, rating, title, description, review date
4. Given a seller receives a review\
   When they check their notifications or dashboard\
   Then they can see the new review notification
5. Given a user views a seller's profile\
    When they scroll to the reviews section\
   Then they can see all reviews sorted by most recent first (with dates in relative format like "2 days ago"), with dropdown filters to sort by rating (high to low, low to high), and a clear average rating displayed at the top with the total number of reviews and a rating distribution
6. Given a user attempts to leave a review for an order they haven't completed\
   When they try to access the review form by manipulating the URL\
   Then the system prevents access with an error page and displays a message stating "Reviews can only be left for completed orders" with a link back to their orders page
7. Given a seller has no reviews yet\
   When a user views their profile\
   Then the system displays "No reviews yet" in the reviews section with an explanation "New seller" and the join date
8. Given a review is submitted on a mobile device\
   When the user completes the review form\
   Then the mobile-optimized form has appropriately sized touch targets for star ratings and submission buttons

Priority: Medium
Story Points: 4

### 9. Accessibility Support

ID: US-009
Title: Accessibility Support
As a: User with disabilities
I want: To use accessibility features like screen readers, keyboard navigation, and high contrast modes
So that: I can effectively use the platform despite visual or motor impairments

Acceptance Criteria:

1. Given a user with visual impairments uses a screen reader\
   When they navigate the platform\
   Then all interactive elements have proper ARIA labels and roles, images have meaningful alt text
2. Given a user relies on keyboard navigation\
   When they use Tab, Enter, Space, and arrow keys\
   Then they can access all interactive elements in a logical order, with visible focus indicators (outline with minimum 2px width)
3. Given a form validation error occurs\
   When a user with a screen reader is completing a form\
   Then the error messages are programmatically associated with the respective form fields using aria-describedby attributes
4. Given a user needs to understand the structure of a complex page\
   When they navigate with a screen reader\
   Then proper heading hierarchy (H1-H6) is implemented throughout the site, with landmark regions (header, nav, main, footer) correctly defined using HTML5 semantic elements and ARIA landmarks

Priority: Medium
Story Points: 4

### 10. Responsive Design

ID: US-010
Title: Mobile-Responsive Interface Support
As a: Mobile user
I want: The platform to adapt seamlessly to my mobile device
So that: I can browse, buy, and sell services on the go

Acceptance Criteria:

1. Given a user accesses the platform from a mobile device (smartphone or tablet)\
   When they load any page\
   Then the layout automatically adjusts to the screen size with no horizontal scrolling required, maintaining all functionality
2. Given a mobile user views listings\
   When they scroll through search results\
   Then the listings display in a single column with image
3. Given a mobile user navigates the platform\
   When they access the menu\
   Then they see a hamburger menu that expands to show navigation options optimized for touch interaction

Priority: High
Story Points: 3

### 11. Language Preferences

ID: US-011
Title: Language Preferences
As a: International user
I want: To change the language of the application
So that: I can use the platform in my preferred language

Acceptance Criteria:

1. Given a user visits the platform\
   When they first access the site\
   Then the system automatically detects their browser/device language setting and displays content in that language if supported (default to English if not supported)
2. Given a user wants to change the display language\
   When they click on the language selector in the site header\
   Then a dropdown menu appears showing available languages with both the language name and a flag icon for each option
3. Given a user selects a different language\
    When they click on their preferred language\
   Then the interface text changes to the selected language immediately and the preference is saved to their account if logged in
4. Given a logged-in user has set a language preference\
   When they log in on a different device\
   Then their language preference is applied automatically

Priority: Medium
Story Points: 4

### 12. Dark Mode Theme

ID: US-012
Title: Dark Mode Theme
As a: User
I want: To toggle between light and dark mode
So that: I can reduce eye strain and save battery life

Acceptance Criteria:

1. Given a user is on any page of the platform\
   When they click the theme toggle button in the header (sun/moon/system icon)\
   Then the interface immediately switches between light, dark and system mode without page reload
2. Given a user enables dark mode\
   When the theme changes\
   Then all UI elements adapt appropriately with dark backgrounds and light text, maintaining a minimum contrast ratio of 4.5:1 for text
3. Given a user has not set a preference\
   When they first visit the platform\
   Then the system applies their device's preferred color scheme if available (via prefers-color-scheme media query) or defaults to light mode if not available
4. Given dark mode is active\
   When viewing images and media content\
   Then these elements are displayed appropriately without excessive brightness or contrast that would create visual discomfort

Priority: Low
Story Points: 2

### 13. Service Preview

ID: US-013
Title: Service Preview
As a: Buyer
I want: To see detailed previews of services with images and examples
So that: I can better understand what I'm purchasing

Acceptance Criteria:

1. Given a user views a service listing\
   When they scroll through the listing details\
   Then they see a gallery of high-quality files (up to 8 per listing) and minimum of one image used as thumbnail
2. Given a user views a service listing with multiple files\
   When they click on any file\
   Then a modal opens with the selected file displayed, with navigation arrows to move between images and a close button in a consistent position
3. Given a service listing includes video content\
   When a user views the listing\
   Then the video can be played directly within the page with standard controls (play/pause, volume)
4. Given a mobile user accesses the service preview\
   When they interact with the gallery\
   Then they can swipe horizontally to navigate between images

Priority: Medium
Story Points: 3

### 14. Notification Settings

ID: US-014
Title: Notification Settings
As a: User
I want: To customize which notifications I receive and how
So that: I can manage platform communications based on my preferences

Acceptance Criteria:

1. Given a user navigates to their account settings\
   When they access the "Notification Preferences" section\
   Then they see separate toggles for different notification categories: Orders, Messages, Reviews
2. Given a user is configuring notification preferences\
   When they interact with each category\
   Then they can select delivery methods for each (email, in-app) independently
3. Given a user wants to disable certain notifications\
   When they turn off a specific notification toggle\
   Then the system immediately updates their preferences in the database and stops sending those notification types across all specified channels
4. Given a user sets "quiet hours"\
   When they specify a time range and timezone\
   Then no push notifications are sent during that time period, while in-app notifications accumulate and are displayed when quiet hours end
5. Given a user wishes to mark all notifications as read\
   When they access their notification center\
   Then they see a "Mark All as Read" button prominently displayed at the top

Priority: Low
Story Points: 3

### 15. In-app Messaging

ID: US-015
Title: In-app Messaging
As a: User
I want: To communicate with other users through an in-app chat system
So that: I can discuss service details before making a purchase

Acceptance Criteria:

1. Given a user views his orders\
    When they click the "Message" button\
   Then a chat interface opens with the recipient's name and profile picture displayed at the top
2. Given a user is in a chat conversation\
   When they type a message and press Enter or click Send\
   Then the message appears in the chat in real time via a websocket connection between two clients
3. Given a user receives a new message while using another part of the platform\
   When the message arrives\
   Then they see a notification toast in the bottom right and hear a subtle notification sound
4. Given a user wishes to upload media content in the chat
   When he clicks on the attachments button at the left of the input field
   Then user is prompted for file he wishes to send which upon submission will immidietally appear as a message with downloadable content

Priority: Medium
Story Points: 5

### 16. Platform offered Solana Wallet

ID: US-016
Title: Platform offered Solana Wallet
As a: User
I want: To make the purchase the service with solana
So that: I can have the quick transaction and payment

Acceptance Criteria:

1. Given User want to make the Solana Payment\
   When User click the buy or sell button on the product page or services\
   Then The client (frontend) app will prompt the user to input the Password which is used to (decrypt/encrypt) the Solana Private Key which is stored in the local Storage. Then, decrypt the private Key and Sign the Transaction.
2. Given User want to see the balance update of their wallet\
    When After User make the solana transfer\
    Then The client (frontend) app will update the balance by calling the GetBalance method with the current User the public Key.
   3 Given User wishes to hold more then one wallet on the platform\
    When Viewing the wallets page
   Then He has the oppurtunity to mark one wallet as main which will be used for both incoming and outgoing transactions
   4 Given User wishes to import a wallet he already owns
   When He accesses the wallets page
   Then He can click on import wallet button which will prompt via a form for mneumonics of the wallet and on submission generate and save to local storage user's encrypted private key

Priority: High
Story Points: 6

### 17. Dispute Resolution

ID: US-017
Title: Feedback and Suggestion System
As a: Platform User
I want: To provide feedback and suggestions for platform improvements
So that: I can contribute to enhancing the user experience and functionality

Acceptance Criteria:

1. Given a user wants to provide feedback about the platform\
   When they click the "Contact us" button in the navbar\
   Then they are presented with a page containing a categorized feedback form with options for "Share your experiences," "Report a bug," "Get support", "Give feedback", "Request Cerificate"
2. Given a user is submitting a bug report\
   When they select the "Bug Report" category\
   Then they see specialized fields including "Steps to Reproduce," "Expected Behavior," "Actual Behavior"

Priority: Low
Story Points: 2

### 18. Compare Services

ID: US-018
Title: Compare Services
As a: Buyer
I want: To compare multiple services side by side
So that: I can make an informed decision on which to purchase

Acceptance Criteria:

1. Given a buyer is browsing service listings\
   When they view a listing and click "Add to Comparison"\
   Then the system adds the listing to a comparison queue and displays a persistent comparison bar showing the number of items added on the right of the screen
2. Given a buyer has added at least 1 service to comparison\
   When they click the "Compare Now" button in the comparison bar\
   Then the system generates a side-by-side comparison view that aligns similar attributes (price, delivery time, seller rating) in rows for easy comparison
3. Given a buyer wants to modify their comparison selection\
   When they click "Remove" on any service in the comparison view\
   Then the system removes that service from the comparison and automatically adjusts the layout
4. Given a buyer attempts to add more than 4 services to comparison\
    When they click "Add to Comparison" on a fifth service\
   Then the system displays a message stating "Maximum of 4 services can be compared at once. Please remove a service before adding a new one" with options to "View Current Comparison"

Priority: Low
Story Points: 3

### 19. Personalized Dashboard

ID: US-019
Title: Personalized Dashboard
As a: User
I want: To see a dashboard with my recent activity and personalized recommendations
So that: I can quickly access relevant information and services

Acceptance Criteria:

1. Given a user logs into their account\
   When they are directed to their dashboard\
   Then they see a personalized overview with clearly labeled sections for Active Orders, Recent Notifications, Earnings/Spending Summary
2. Given a seller views their dashboard\
   When they check the "Earnings"\
   Then they see accurate statistics including current balance, pending payments and monthly earnings graph based on active orders with a visual indicator of performance compared to previous month (up/down percentage)
3. Given a buyer wishes to manage all of the avaliable functionality that are provided by the plaform on web app\
   When They access the dashboard button available on the navbar\
   Then: They can see all the links to subsections of the dashbaord(my gigs, my reviews, verification center, overview, reports, orders, wallets) displayed prominently with an icon.

Priority: Medium
Story Points: 4

### 20. Portfolio Display

ID: US-020
Title: Portfolio Display
As a: Seller
I want: To showcase my previous work in a visually appealing portfolio
So that: Potential buyers can see examples of my skills and quality

Acceptance Criteria:

1. Given a seller is uploading portfolio items\
   When they add a new item\
   Then they can upload multiple file types (images: JPG, PNG, documents: PDF; videos: MP4;), add a title (required), description
2. Given a seller has uploaded portfolio items\
   When they arrange their portfolio\
   Then they can drag and drop files and set a cover image for each item
3. Given a seller wants to link to portfolio outside of our web app\
   When they can submit an optional URL field alongisde each portfolio item"\
   Then the portfolio item on their profile will provide a button that upon clicking will redirect on a new page to the linked contents

Priority: Medium
Story Points: 4

### 21. User Activity Report

ID: US-021
Title: User Activity Report
As a: Platform User (Seller or Buyer)
I want: To generate a report of my activities, including transactions and interactions
So that: I can review my past activities, track performance, and manage my business effectively

Acceptance Criteria:

1. Given a user generates a Transaction History report\
   When they click "Generate Report"\
   Then the system creates a detailed report showing all transactions with timestamps, transaction IDs, counterparties, amounts, statuses, and relevant order details
2. Given a user wants to save their report for later reference\
   When they click "Export Report"\
   Then they receive options to download in PDF format with appropriate formatting and a confirmation message upon successful download

Priority: Medium
Story Points: 5

### 22. Copy Transaction ID and Check on Block Scanner

ID: US-022
Title: Copy Transaction ID and Check on Block Scanner
As a: Platform User (Seller or Buyer)
I want: To copy my transaction ID and check its status on a blockchain explorer
So that: I can verify the transaction details and ensure it has been processed successfully

Acceptance Criteria:

1. Given a user views the details of a completed cryptocurrency transaction\
   When they locate the transaction ID field\
   Then they see by default hidden full transaction hash which can be shown via button next to the abbriviated hash
2. Given a user wants to copy the transaction ID\
   When they click the visible "Copy" button adjacent to the transaction ID\
   Then the complete transaction hash is copied to their clipboard visually changing the icons appearance to indicate success for 3 seconds
3. Given a user wants to verify the transaction on the blockchain\
   When they click the View on Blockchain Explorer button\
    Then a new browser tab opens loading the blockchain explorer with the transaction details already queried and displayed

Priority: Medium
Story Points: 3

### 23. User Manual

ID: US-023
Title: User Manual
As a: Platform User (Seller or Buyer)
I want: A comprehensive user manual that guides me on how to use the application effectively
So that: I can easily navigate and utilize all features without confusion

Acceptance Criteria:

1. Given a user accesses the platform\
   When they click on the "FAQ" option in the navigation menu\
   Then they are directed to a comprehensive user manual with a clear table of contents filterable via search bar at the top
2. Given a user views the help\
   When they click the help option in the navigation menu\
   Then: They are redirect to the page which contains all of the details features which are avaliable on the platform and how to use them
3. Given a user wants to find specific information quickly\
   When: They click the each related section in the "HELP" section\
   Then: They will be redirected to the related section in which all of the information about (how to integrate with wallet, Reviews and Ratings and Payments and Transactions)

Priority: Medium
Story Points: 3

### 24. Seller Verification and Badges

ID: US-024
Title: Seller Verification and Badges
As a: Seller
I want: To become verified and earn recognition badges
So that: I can build trust with potential buyers and showcase my expertise

Acceptance Criteria:

1. Given a seller wants to become verified\
   When they navigate to "Verification Center" in their seller dashboard\
   Then they see requirements including: completing their profile (100%), kyc veryfying their profile and having at least 5 completed orders with positive ratings
2. Given a seller completes all verification steps successfully\
   When the review process is completed\
   Then they receive a "Verified Seller" badge displayed prominently on their profile and listings, increased visibility in search results with a "Verified" filter option
3. Given a seller consistently maintains high-quality service\
   When they meet specific performance criteria (eg. 95%+ positive reviews, on-time delivery rate >90%, response time <2 hours, for 3 consecutive months)\
   Then they automatically earn a badge that they can choose to appear alongside their profile at all times
4. Given a seller demonstrates expertise in specific fields\
   When they provide proof of credentials (certifications, degrees, licensing) relevant to their service category\
   Then after review and validation, they receive field-specific "Expert" badges (e.g., "Certified Designer," "Licensed Consultant") relevant to their verified expertise
5. Given a user views his verification center\
   When they see various badges they earned\
   Then they can hover over or click each badge to see detailed criteria for how it was earned, when it was awarded, and what it signifies about the seller's qualifications or performance

Priority: High
Story Points: 5
