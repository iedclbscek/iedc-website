# IIC Admin Dashboard Setup Guide

This guide explains how to set up and use the new IIC Admin dashboard functionality.

## Overview

The IIC Admin role provides limited access to the dashboard with the following capabilities:
- View IIC member registrations (limited to: Name, Phone, Email, Department, Semester)
- View execom call responses (limited to: Name, Phone, Email, Department, Semester)
- Export data to CSV format
- Search and filter functionality

## Setup Instructions

### 1. Create the IIC Admin User

Run the seed script to create the iic_admin user:

```bash
cd server
node seed-iic-admin.js
```

**Default Credentials:**
- Username: `iic_admin`
- Password: `iic@lbscek`

### 2. Database Changes

The User model has been updated to include the new `iic_admin` role. The role is now available in the enum:

```javascript
role: {
  type: String,
  enum: [
    "admin",
    "nodal_officer", 
    "ceo",
    "lead",
    "co_lead",
    "coordinator",
    "member",
    "iic_admin"  // New role
  ],
  default: "member",
}
```

### 3. Frontend Components

New components have been created:

- `IicDashboardHome.jsx` - Dashboard home for IIC admin users
- `IicRegistrationView.jsx` - Limited registration view
- `IicExecomCallResponses.jsx` - Limited execom responses view

### 4. Navigation Changes

The dashboard navigation automatically adapts based on user role:
- **Regular Admin**: Full access to all dashboard features
- **IIC Admin**: Limited access to IIC-specific features only

## Usage

### Logging In

1. Navigate to `/login`
2. Use credentials: `iic_admin` / `iic@lbscek`
3. You'll be redirected to the IIC-specific dashboard

### Available Features

#### Dashboard Home
- Overview statistics
- Quick access to IIC registrations and responses
- Information about available data and export options

#### IIC Registrations
- View member registrations with limited details
- Search by name or email
- Filter by department and semester
- Export filtered data to CSV

#### IIC Execom Responses
- View execom call responses
- Search and filter functionality
- Export responses to CSV
- View detailed response information in modal

### Data Limitations

The IIC admin role can only access:
- **Name** (First + Last)
- **Phone Number**
- **Email Address**
- **Department**
- **Semester**

**No access to:**
- Admission numbers
- Referral codes
- Year of joining
- Interests
- Other sensitive information

## Security Features

1. **Role-based Access Control**: Users can only access features appropriate to their role
2. **Data Filtering**: API responses are filtered based on user permissions
3. **Audit Trail**: All actions are logged for security purposes

## Troubleshooting

### Common Issues

1. **User not found**: Ensure the seed script ran successfully
2. **Access denied**: Check that the user has the `iic_admin` role
3. **Missing data**: Verify that registrations and responses exist in the database

### Support

For technical issues, check:
1. Database connection
2. User role assignment
3. API endpoint accessibility
4. Frontend component loading

## Future Enhancements

Potential improvements for the IIC admin role:
- Additional export formats (PDF, Excel)
- Advanced analytics and reporting
- Bulk operations on filtered data
- Custom dashboard widgets
- Email notification system

## API Endpoints

The following endpoints are accessible to IIC admin users:
- `GET /api/registrations` - View registrations (limited fields)
- `GET /api/execom-call-responses` - View responses (limited fields)

All endpoints respect role-based access control and return only authorized data.


