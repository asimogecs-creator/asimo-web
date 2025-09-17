# About Section Content Management

## Overview

The About section content is now managed through a JSON file system, allowing easy content updates without editing HTML files directly.

## Files Structure

```
├── data/
│   └── about.json          # About section content data
├── js/modules/
│   └── about-manager.js    # JavaScript module for loading content
└── index.html              # Main page with About section
```

## About Section JSON Structure

### File Location
`data/about.json`

### JSON Format

```json
{
    "sectionTitle": "About ASIMO Technical Club",
    "sectionSubtitle": "Government Engineering College Samastipur's Premier Technical Club",
    "description": {
        "paragraph1": "First paragraph content with HTML tags...",
        "paragraph2": "Second paragraph content...",
        "paragraph3": "Third paragraph content..."
    },
    "highlights": [
        {
            "icon": "fas fa-university",
            "text": "Highlight text with HTML tags"
        }
    ],
    "image": {
        "src": "assets/images/tech-event.jpg",
        "alt": "Image alt text for SEO",
        "overlayTitle": "Image overlay title",
        "overlayDescription": "Image overlay description"
    }
}
```

## How to Update About Section Content

### 1. Edit Text Content

To change the main content, edit `data/about.json`:

```json
{
    "sectionTitle": "Your New Title",
    "sectionSubtitle": "Your New Subtitle",
    "description": {
        "paragraph1": "Your first paragraph...",
        "paragraph2": "Your second paragraph...",
        "paragraph3": "Your third paragraph..."
    }
}
```

### 2. Update Highlights

Modify the highlights array to change the feature boxes:

```json
{
    "highlights": [
        {
            "icon": "fas fa-university",
            "text": "<strong>Your Institution Name</strong>"
        },
        {
            "icon": "fas fa-map-marker-alt", 
            "text": "<strong>Your Location</strong>"
        },
        {
            "icon": "fas fa-cogs",
            "text": "<strong>Your Specialty</strong>"
        },
        {
            "icon": "fas fa-graduation-cap",
            "text": "<strong>Your Achievement</strong>"
        }
    ]
}
```

### 3. Change Image

To update the About section image:

1. **Replace the image file:**
   - Add your new image to `assets/images/` folder
   - Recommended size: 800x600px or similar aspect ratio

2. **Update the JSON:**
   ```json
   {
       "image": {
           "src": "assets/images/your-new-image.jpg",
           "alt": "Descriptive alt text for SEO",
           "overlayTitle": "Image Overlay Title",
           "overlayDescription": "Image Overlay Description"
       }
   }
   ```

## Available Font Awesome Icons

For highlights, you can use any Font Awesome icon:

- `fas fa-university` - University/College
- `fas fa-map-marker-alt` - Location
- `fas fa-cogs` - Technical/Engineering
- `fas fa-graduation-cap` - Education
- `fas fa-users` - Team/Community
- `fas fa-lightbulb` - Innovation
- `fas fa-rocket` - Progress/Growth
- `fas fa-trophy` - Achievement
- `fas fa-star` - Excellence
- `fas fa-globe` - Global/Reach

## HTML Tags Support

The JSON content supports HTML tags for formatting:

- `<strong>text</strong>` - Bold text
- `<em>text</em>` - Italic text
- `<br>` - Line break
- `<a href="url">link</a>` - Links

## SEO Considerations

When updating content, maintain SEO keywords for better Google ranking:

### Important Keywords to Include:
- ASIMO
- Technical Club
- GEC
- GECS
- Samastipur
- Government Engineering College
- Engineering College
- Technical
- Government Engineering College Samastipur

### Example SEO-Optimized Content:
```json
{
    "description": {
        "paragraph1": "<strong>ASIMO Technical Club</strong> is the premier <strong>technical</strong> organization at <strong>Government Engineering College Samastipur (GEC Samastipur)</strong>, also known as <strong>GECS</strong>..."
    }
}
```

## Testing Your Changes

After updating `about.json`:

1. Save the file
2. Refresh your website
3. The About section will automatically load the new content
4. Check browser console for any errors

## Troubleshooting

### Content Not Loading
1. Check JSON syntax using online JSON validator
2. Ensure file path is correct: `data/about.json`
3. Check browser console for JavaScript errors

### Images Not Showing
1. Verify image file exists in specified path
2. Check image file format (JPG, PNG, WebP supported)
3. Ensure proper file permissions

### Layout Issues
1. Keep text length reasonable for responsive design
2. Test on mobile devices
3. Maintain consistent content structure

## Backup

Always backup your `about.json` file before making changes:

```bash
cp data/about.json data/about.json.backup
```

## Advanced Usage

### Programmatic Updates

You can also update content programmatically using JavaScript:

```javascript
// Get the about manager instance
const aboutManager = new AboutManager();

// Update specific content
aboutManager.updateAboutData({
    sectionTitle: "New Title",
    description: {
        paragraph1: "New content..."
    }
});
```

### Dynamic Content Loading

The system supports dynamic content loading, so you can:
- Update content without page refresh
- Load different content based on user preferences
- Implement content versioning

## Support

For technical support or questions about content management:
1. Check browser console for error messages
2. Validate JSON syntax
3. Ensure all file paths are correct
4. Test in different browsers

---

**Last Updated:** September 18, 2025