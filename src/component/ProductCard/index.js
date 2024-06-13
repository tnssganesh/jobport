import {Link} from 'react-router-dom'

import './index.css'

const ProductCard = props => {
  const {productData} = props
  const {
    title,
    companyLogoUrl,
    packagePerAnnum,
    location,
    jobDescription,
    employmentType,
    rating,
    id,
  } = productData

  return (
    <li className="product-item">
      <Link to={`/jobs/${id}`} className="link-item">
        <img src={companyLogoUrl} alt="company logo" className="thumbnail" />
        <h1 className="title">{title}</h1>
        <div className="rating-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
          <p className="rating">{rating}</p>
        </div>
        <p className="brand"> {location}</p>
        <div className="product-details">
          <p className="price">{employmentType}</p>
          <p>{packagePerAnnum}</p>
          <hr />
          <h1>Description</h1>
          <p className="desp">{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}
export default ProductCard
