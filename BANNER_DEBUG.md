# 🔧 Banner Image Loading Debug Guide

## ✅ **Issue Fixed: Image Base URL**

### **Problem Found:**
```env
# WRONG (was pointing to frontend)
VITE_IMAGE_BASE_URL=http://localhost:5173

# FIXED (now pointing to backend)  
VITE_IMAGE_BASE_URL=http://localhost:8081
```

### **🚀 Next Steps:**

1. **Restart Development Server:**
```bash
# Stop current server (Ctrl+C if running)
npm run dev
```

2. **Test Image URL Building:**
Open browser console and check:
```
🖼️ Dynamic Image URLs: {
  desktop: "http://localhost:8081/uploads/banners/...",
  mobile: "http://localhost:8081/uploads/banners/...",
  baseUrl: "http://localhost:8081"
}
```

3. **Verify Banner Loading:**
- Homepage banner should load from: `http://localhost:8081/uploads/banners/homepageBanner_banner_...`
- Mobile banner should load from: `http://localhost:8081/uploads/banners/homepageBanner_mobilebanner_...`

### **🔍 Debug Checks:**

**Console logs to watch:**
```
✅ Banners loaded from cache
🖼️ Dynamic Image URLs: { desktop: "...", mobile: "..." }
🌐 Banner Image Loading: { loadingConfig: {...} }
```

**Network tab verification:**
- Check if images are loading from `localhost:8081`
- Verify 200 responses for banner images
- Look for 404 errors on image requests

### **🎯 Expected Results:**

After restart, you should see:
- ✅ Homepage banner displays
- ✅ Mobile banner displays  
- ✅ No 404 errors in network tab
- ✅ Console shows correct URLs (port 8081)

### **🚨 If Still Not Working:**

Check backend static file serving:
1. Ensure backend serves static files from `/uploads` folder
2. Verify backend has CORS enabled for image requests
3. Check if images actually exist in backend `/uploads/banners/` folder

**File to check in admin panel:**
```javascript
// app.js or server.js
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

---

**Status:** Image base URL fixed to port 8081 ✅
**Next:** Restart dev server to apply changes 🔄