import React, { useState } from 'react';
import { CiEdit, CiImageOn, CiLocationOn } from 'react-icons/ci';
import { RiDeleteBinLine } from 'react-icons/ri';

export default function DisplayProduct({
  products,
  handleEditProduct,
  handleDeleteProduct,
  handleEditPlace,
  handlePic
}) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionWordsLimit = 20;

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const renderDescription = (product) => {
    if (
      showFullDescription ||
      product.description.split(' ').length <= descriptionWordsLimit
    ) {
      return product.description;
    } else {
      const words = product.description
        .split(' ')
        .slice(0, descriptionWordsLimit)
        .join(' ');
      return `${words} ...`;
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="card"
              style={{ width: '18rem', margin: '10px' }}
            >
              {product.image && (
                <img
                  src={`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/${product.image}`}
                  className="card-img-top"
                  alt={product.title}
                  style={{
                    objectFit: 'cover',
                    maxWidth: '300px',
                    maxHeight: '200px',
                    minWidth: '200px',
                    minHeight: '100px',
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}

              <div className="card-body">
                <h5 className="card-text">{product.name}</h5>
                <p style={{fontSize:"12px"}}>Product Category: {product.category}</p>
                <p style={{fontSize:"12px"}}>Product Price: ${product?.productPrices?.[0]?.price}</p>
                <p style={{fontSize:"12px"}}>Product Quantity: {product.quantity}</p>
              
                <p style={{fontSize:"12px"}}>Product Size:{product.sizeProduct}</p>
                <p style={{fontSize:"12px"}}>
                  {renderDescription(product)}{' '}
                  <span
                    className="read-more-text"
                    style={{
                      color: '#7e5888',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                    onClick={toggleDescription}
                  >
                    {showFullDescription ? 'Hide' : 'Read more'}
                  </span>
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px',
                  }}
                >
                  <div className="m-1">
                    <CiEdit size={25} onClick={() => handleEditProduct(product._id)} />
                  </div>
                  <div className="m-1">
                    <RiDeleteBinLine size={25} onClick={() => handleDeleteProduct(product._id)} />
                  </div>
                  <div className="m-1">
                    <CiImageOn size={25} onClick={() => handlePic(product._id)}/>
                  </div>
                  {product.category === 'Local business' ? (
                    <div className="m-1">
                      <CiLocationOn size={25} onClick={() => handleEditPlace(product._id)} />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
}
