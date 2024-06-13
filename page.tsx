"use client";

import styles from "./page.module.css";
import axios from "axios";
import { useState, useEffect } from "react";

interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
}

export default () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string>('');
    const [sort, setSort] = useState<string>('asc');
    const [limit, setLimit] = useState<number>(1);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

    const onChangeSort = (e) => {
        setSort(e.target.value);
    };

    const onChangeLimit = (e) => {
        setLimit(Number(e.target.value));
    };

    const onCheckboxChange = (id: number) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((itemId) => itemId !== id)
                : [...prevSelected, id]
        );
    };

    const onDeleteSelected = () => {
        setProducts((prevProducts) =>
            prevProducts.filter((product) => !selectedProducts.includes(product.id))
        );
        setSelectedProducts([]);
    };

    useEffect(() => {
        axios.get(`https://fakestoreapi.com/products?limit=${limit}&sort=${sort}`)
            .then((result) => {
                setProducts(result.data);
                setError('');
            })
            .catch(() => {
                setError('Sorry we are not capable to provide a proper data from the server');
            });
    }, [sort, limit]);

    return (
        <div className={styles.myMainContainer}>
            <div className={styles.myContainer}>
                <div className={styles.myTopSectionWrapper}>
                    <select onChange={onChangeSort} value={sort}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    <input type="number" onChange={onChangeLimit} value={limit} min={1} />
                    <button className={styles.myButtonStyling} onClick={onDeleteSelected}>
                        Delete
                    </button>
                </div>
                <div className={styles.myBottomSectionWrapper}>
                    {error && <p>{error}</p>}
                    <ul className={styles.myListStylingWrapper}>
                        {products.map((item: Product) => (
                            <li className={styles.myListWrapper} key={item.id}>
                                <div className={styles.myListWrapperFirstInnerContainer}>
                                    <img className={styles.myImageStyling} src={item.image} alt={item.title} />
                                    <div className={styles.myItemDescriptionWrapper}>
                                        <span className={styles.myTitleWrapper}>{item.title}</span>
                                        <span className={styles.myDescriptionWrapper}>{item.description}</span>
                                        <div className={styles.myPriceWrapper}>${item.price}</div>
                                    </div>
                                </div>
                                <div className={styles.myListWrapperSecondInnerContainer}>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(item.id)}
                                        onChange={() => onCheckboxChange(item.id)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
