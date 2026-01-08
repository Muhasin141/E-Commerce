# E-Commerce

Full-Stack E-Commerce Web Application (MERN)
This is a full-stack e-commerce web application built using the MERN Stack that allows users to browse products, view product details, manage cart & wishlist, save delivery addresses, and place orders.
The system is designed to provide a simple, structured, and real-world shopping experience with clean UI and organized backend APIs.
---

##  Demo Link
[Live Demo ](https://e-commerce-dun-seven.vercel.app/)

---
## Quick Start
```git clone https://github.com/Muhasin141/E-Commerce.git
cd E-Commerce
npm install
npm start
```
***Note: A fixed demo user is used (no authentication system)***
 ---
## Technologies 
- React JS
- React Router
- Node JS
- Express
- MongoDB + Mongoose
- REST APIs
- CORS Middleware

---
## Demo Video
Watch a walkthrough (5–7 minutes) explaining:
[Video Link](https://drive.google.com/file/d/1oq7cBftYioM_foGr033CKh-whHtKNccb/view?usp=drivesdk)

---

## Features
### Product Catalogue
- List all products
- Product images, price & details
- Category-wise filtering
- Search by product name
- Sort by price
- Single product page

### Shopping Cart
- Add to cart
- Increase / decrease quantity
- Remove product
- Remove specific variant (size)
- Clear entire cart
- Auto-update totals

### Wishlist
- Add / remove product
- Supports product + size
- Clear wishlist
- Product details auto populated

### User Profile Includes
- Name & contact details
- Saved addresses
- Cart
- Wishlist
- Order history

### Address Management (CRUD)
- Add new address
- Edit address
- Delete address
- Mark default address
- Auto-unset previous default

### Orders & Order History
- Place order
- Store past orders
- View all orders
- View order details

---
## API References
### Products API
***GET /api/products***
Fetch all products<br>
Sample Response<br>
``` [{ _id", name,description,price,originalPrice,inStock,availableSizes,category,imageUrl,rating,createdAt,updatedAt}......] ```

***GET /api/products/:productId***
Fetch a product<br>
Sample Response<br>
``` [{ _id", name,description,price,originalPrice,inStock,availableSizes,category,imageUrl,rating,createdAt,updatedAt}] ```

### Cart API
***GET /api/cart***
Fetch User Cart<br>
Sample Response<br>
``` [{product{}, quality,size},.....] ```

***POST /api/cart***
Add item / increase quantity<br>
Sample Response<br>
``` [{product Id,size}] ```

***DELETE /api/cart/:productId***
Remove product<br>
``` [{product Id,size}] ```

***DELETE /api/cart/clear***
Clear entire cart<br>

### Wishlist API

***GET /api/wishlist***
Fetch wishlist<br>
Sample Response<br>

```[{"product": {_id,name, price},size: M}]```


***POST /api/wishlist***
Add / remove wishlist item<br>
Sample Response<br>

```[{"product": {_id,name, price},size: M}]```

***DELETE /api/wishlist/clear***
Clear wishlist

### User Profile API
***GET /api/user/profile***
Fetch user profile (password excluded)<br>
Sample Response<br>
```{_id,name,email,addresse, cart,wishlist,orderHistory}```

***PUT /api/user/profile***
Update profile<br>
Sample Response<br>
```{_id,name,email,addresse, cart,wishlist,orderHistory}```

### Address Management API
***GET /api/user/addresses***
Get all addresses<br>
Sample Response<br>
```[{fullName,street,city,state,zipCode,phone,isDefault},....]```


***POST /api/user/addresses***
Add address<br>
Sample Response<br>
```[{fullName,street,city,state,zipCode,phone,isDefault}]```

***PUT /api/user/addresses/:addressId***
Update address<br>
Sample Response<br>
```[{fullName,street,city,state,zipCode,phone,isDefault}]```

***DELETE /api/user/addresses/:addressId***
Delete address<br>
Sample Response<br>
```[{fullName,street,city,state,zipCode,phone,isDefault}]```


### Orders API
***GET /api/user/orders***
Get all orders of user<br>
Sample Response<br>

```[{_id: ,user,items: [{product,name,quantity,price,size }],shippingAddress:{fullName,street,city,state,zipCode,phone},totalAmount,orderStatus,createdAt},
......]```

***GET /api/user/order/:orderId***
Get single order<br>
Sample Response<br>
```{_id: ,user,items: [{product,name,quantity,price,size }],shippingAddress {fullName,street,city,state,zipCode,phone},totalAmount,orderStatus,createdAt}```

***POST /api/user/orders***
Place order<br>
Sample Response<br>
```{_id: ,user,items: [{product,name,quantity,price,size }],shippingAddress {fullName,street,city,state,zipCode,phone},totalAmount,orderStatus,createdAt}```
 ---
## Contact 
For bugs or feature request, please reach out to muhasinalikhan@gmail.com



