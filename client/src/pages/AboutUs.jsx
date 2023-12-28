import React, { useState, useEffect } from 'react';
import {
  fetchProductsByFilter,
  getProducts,
  getProductsCount,
} from '../functions/product';
import { getCategories } from '../functions/category';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import { Menu, Slider, Checkbox } from 'antd';
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from '@ant-design/icons';
import Star from '../components/forms/Star';
import Pagination from '../components/pagination/Pagination';

const { SubMenu, ItemGroup } = Menu;
const formatter = (value) => `${value} VND`;

const AboutUs = () => {
  return (
    <>
      <div className="container mt-100 mb-5">
        <div className="pt-1" style={{ width: '100%' }}>
          <h1 className="mt-5">Giới thiệu</h1>
          <h2>NovelNiche</h2>
          <div className="mt-3 d-flex align-items-top">
            <div className="" style={{ textAlign: 'justify' }}>
              <p>
                NovelNiche là một cửa hàng sách online độc đáo và đầy sáng tạo,
                nơi mang đến trải nghiệm mua sắm sách tuyệt vời nhất cho độc giả
                đam mê văn hóa đọc. Với một bộ sưu tập đa dạng bao gồm cả các
                thể loại văn học, NovelNiche cam kết đem đến cho khách hàng
                những tác phẩm nổi bật từ các tác giả nổi tiếng và những tên
                tuổi mới xuất sắc.
              </p>
              <p>
                Cửa hàng không chỉ chú trọng vào việc cung cấp sách in truyền
                thống, mà còn đặt mình ở tầm cao mới với ưu tiên hàng đầu cho
                sách điện tử và âm thanh. NovelNiche hiểu rằng sự tiện lợi và đa
                dạng là chìa khóa để kết nối độc giả với thế giới từng trang
                sách.
              </p>
              <p>
                Với giao diện trực quan và tinh tế, NovelNiche giúp người dùng
                dễ dàng tìm kiếm, đánh giá và chia sẻ ý kiến về các tác phẩm mà
                họ yêu thích. Chất lượng phục vụ và cam kết chất lượng là những
                giá trị cốt lõi tạo nên danh tiếng uy tín của NovelNiche trong
                cộng đồng độc giả. Hãy cùng chúng tôi trải nghiệm không gian đọc
                sách mới và độc đáo tại NovelNiche!
              </p>
            </div>
            <div className="ml-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.772594042191!2d106.67290467460565!3d10.980529955396682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d1085e2b1c37%3A0x73bfa5616464d0ee!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBUaOG7pyBE4bqndSBN4buZdA!5e0!3m2!1svi!2s!4v1700065345208!5m2!1svi!2s"
                width="600"
                height="450"
                style={{ border: '0' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
