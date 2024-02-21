
//custom marker

export const CustomMarker = new google.maps.Marker({
    draggable: true,
    animation: google.maps.Animation.BOUNCE,
  });

CustomMarker.addListener("click", toggleBounce);

function toggleBounce() {
    if (CustomMarker.getAnimation() !== null) {
        CustomMarker.setAnimation(null);
    } else {
        CustomMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
