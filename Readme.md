## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd estate_website
```

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create environment file
.env
```

## 🔑 Environment Configuration

### Backend (.env)

Create a `.env` file in the Backend directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

```

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install
```

## 🗄 Database Setup

### Option 1: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGO_URI` in your `.env` file

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/realestate`

## 🚀 Running the Application

### Development Mode

#### Start Backend Server:

```bash
cd Backend
npm start
```

Server will run on: `http://localhost:5000`

#### Start Frontend Development Server:

```bash
cd Frontend
npm start
```

Frontend will run on: `http://localhost:3000`

## 📁 Project Structure

```
├── 📁 Backend
│   ├── 📁 config
│   │   └── 📄 db.js
│   ├── 📁 controllers
│   │   ├── 📄 authController.js
│   │   ├── 📄 propertyController.js
│   │   └── 📄 uploadController.js
│   ├── 📁 images
│   ├── 📁 middlewares
│   │   ├── 📄 VertifyToken.js
│   │   └── 📄 asyncweapper.js
│   ├── 📁 models
│   │   ├── 📄 Property.js
│   │   └── 📄 User.js
│   ├── 📁 utilites
│   │   ├── 📄 appError.js
│   │   └── 📄 statusText.js
│   ├── 📄 index.js
│   ├── ⚙️ package-lock.json
│   └── ⚙️ package.json
├── 📁 client
│   ├── 📁 public
│   │   ├── 📄 favicon.ico
│   │   ├── 🌐 index.html
│   │   ├── 🖼️ logo192.png
│   │   ├── 🖼️ logo512.png
│   │   ├── ⚙️ manifest.json
│   │   └── 📄 robots.txt
│   ├── 📁 src
│   │   ├── 📁 assets
│   │   │   ├── 🖼️ estate.jpg
│   │   │   ├── 🖼️ estate2.jpg
│   │   │   ├── 🖼️ estate3.jpg
│   │   │   ├── 🖼️ estate4.jpg
│   │   │   ├── 🖼️ estate5.jpg
│   │   │   ├── 🖼️ person.jpg
│   │   │   ├── 🖼️ realestatebeach.jpg
│   │   │   ├── 🖼️ realestatecountryside.jpg
│   │   │   ├── 🖼️ realestatemountain.jpg
│   │   │   ├── 🖼️ yacht1.jpg
│   │   │   ├── 🖼️ yacht2.jpg
│   │   │   └── 🖼️ yacht3.jpg
│   │   ├── 📁 components
│   │   │   ├── 📁 comment
│   │   │   │   ├── 📄 Comment.jsx
│   │   │   │   └── 🎨 comment.module.css
│   │   │   ├── 📁 featuredproperties
│   │   │   │   ├── 📄 Featuredproperties.jsx
│   │   │   │   └── 🎨 featuredproperties.module.css
│   │   │   ├── 📁 footer
│   │   │   │   ├── 📄 Footer.jsx
│   │   │   │   └── 🎨 footer.module.css
│   │   │   ├── 📁 hero
│   │   │   │   ├── 📄 Hero.jsx
│   │   │   │   └── 🎨 hero.module.css
│   │   │   ├── 📁 navbar
│   │   │   │   ├── 📄 Navbar.jsx
│   │   │   │   └── 🎨 navbar.module.css
│   │   │   ├── 📁 newsletter
│   │   │   │   ├── 📄 Newsletter.jsx
│   │   │   │   └── 🎨 newsletter.module.css
│   │   │   ├── 📁 popularProperties
│   │   │   │   ├── 📄 PopularProperties.jsx
│   │   │   │   └── 🎨 popularProperties.module.css
│   │   │   ├── 📁 properties
│   │   │   │   ├── 📄 Properties.jsx
│   │   │   │   └── 🎨 properties.module.css
│   │   │   ├── 📁 propertyDetail
│   │   │   │   ├── 📄 PropertyDetail.jsx
│   │   │   │   └── 🎨 propertyDetail.module.css
│   │   │   ├── 📁 propertycard
│   │   │   │   ├── 📄 PropertyCard.jsx
│   │   │   │   └── 🎨 propertyCard.module.css
│   │   │   ├── 📁 signin
│   │   │   │   ├── 📄 Signin.jsx
│   │   │   │   └── 🎨 signin.module.css
│   │   │   └── 📁 signup
│   │   │       ├── 📄 Signup.jsx
│   │   │       └── 🎨 signup.module.css
│   │   ├── 📁 redux
│   │   │   ├── 📄 authSlice.js
│   │   │   └── 📄 store.js
│   │   ├── 📁 util
│   │   │   ├── 📄 fetchAPI.js
│   │   │   ├── 📄 idxToContinent.js
│   │   │   └── 📄 idxToPriceRange.js
│   │   ├── 🎨 App.css
│   │   ├── 📄 App.js
│   │   └── 📄 index.js
│   ├── ⚙️ .gitignore
│   ├── 📝 README.md
│   ├── ⚙️ package-lock.json
│   └── ⚙️ package.json
├── ⚙️ .gitignore
└── 📝 Readme.md
```
