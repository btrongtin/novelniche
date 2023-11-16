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
            <div className="">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Asperiores sunt vel ipsam unde vero, rem beatae cum debitis
                quisquam, dolor veniam obcaecati omnis. Aliquid non quae commodi
                iste, atque debitis? Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Sunt, molestias. Dolor odio vitae debitis esse
                facilis labore dicta fuga sequi nam, cum dolore exercitationem
                aut praesentium autem recusandae similique ullam.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
                perspiciatis, doloribus eius impedit voluptatibus nemo magni rem
                rerum temporibus sunt assumenda vero repellat aut voluptatem
                quibusdam amet tempore cumque nihil. Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Iste, cupiditate harum? Saepe quod
                sunt, aut voluptate laudantium, repudiandae ex natus excepturi,
                vero minus dicta maiores nostrum laborum iure perferendis
                magnam!
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
                non ex quidem quisquam ullam earum ea animi omnis velit aut
                veniam odio aperiam mollitia, sit magnam repellendus, molestiae
                voluptates quod? Lorem ipsum dolor, sit amet consectetur
                adipisicing elit. Quo, nihil! Architecto distinctio dolore
                aperiam laudantium earum nostrum unde, nam officiis ipsum beatae
                delectus, iure dolorem dignissimos, maiores facilis harum qui.
              </p>
            </div>
            <div className="">
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
