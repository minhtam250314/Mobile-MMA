import { View, StyleSheet } from 'react-native';
import React from 'react';
import { SliderBox } from 'react-native-image-slider-box';
import { COLORS, SIZES } from '../constants'


const Carousel = () => {
    const slides = [
      "https://i0.wp.com/artmall.co.ke/wp-content/uploads/2023/02/Items-in-a-Gift-Shop.png?ssl=1",
      "https://www.seasidecountrystore.com/cdn/shop/articles/IMG_5184_2048x.jpg?v=1536683084",
      "https://diefenbunker.ca/wp-content/uploads/2019/04/56549549_302856720392856_336805137714511872_n-1080x675.jpg",
      ];
  return (
   
      <View style={styles.carouselContainer}>
      <SliderBox images={slides}
        dotColor={COLORS.primary}
        inactiveDotColor={COLORS.secondary}
        ImageComponentStyle={{borderRadius: 15, width: '93%', marginTop: 15,}}
        autoplay
        circleLoop
        
      />
    
    </View>
  )
}

export default Carousel;

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    alignItems: "center",
    
    
  },
});