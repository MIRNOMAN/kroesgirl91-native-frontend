# Tracking Status Images

Place your tracking status images in this folder with the following names:

- `accepted.png` - Icon for "Accepted" status
- `picked.png` - Icon for "Picked" status
- `transit.png` - Icon for "In Transit" status
- `outfordelivery.png` - Icon for "Out for Delivery" status
- `delivered.png` - Icon for "Delivered" status

## How to use the images

After adding your images to this folder, update the `CurrentShipment.tsx` component:

Replace this line in the `getStatusImage` function:

```typescript
return null;
```

With:

```typescript
switch (imageName) {
  case "accepted":
    return require("../../../assets/tracking/accepted.png");
  case "picked":
    return require("../../../assets/tracking/picked.png");
  case "transit":
    return require("../../../assets/tracking/transit.png");
  case "outfordelivery":
    return require("../../../assets/tracking/outfordelivery.png");
  case "delivered":
    return require("../../../assets/tracking/delivered.png");
  default:
    return null;
}
```

Then update the image placeholder in the component:

```typescript
{/* Replace this */}
<View style={styles.imagePlaceholder}>
  <Text style={styles.imagePlaceholderText}>
    {statusItem.image.substring(0, 2).toUpperCase()}
  </Text>
</View>

{/* With this */}
<Image
  source={getStatusImage(statusItem.image)}
  style={{ width: 32, height: 32 }}
  resizeMode="contain"
/>
```

Recommended image size: 64x64px or 128x128px (PNG with transparency)
