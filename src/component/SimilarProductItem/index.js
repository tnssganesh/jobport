import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {
    title,
    companyLogoUrl,
    packagePerAnnum,
    location,
    jobDescription,
    employmentType,
    rating,
    id,
  } = productDetails

  return (
    <li className="similar-product-item">
      <img src={companyLogoUrl} alt="job" className="thumbnail" />
      <h1 className="title">{title}</h1>
      <div className="rating-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
    </li>
  )
}

export default SimilarProductItem
