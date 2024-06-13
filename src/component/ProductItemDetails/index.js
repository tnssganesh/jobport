import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = product => ({
    companyLogoUrl: product.company_logo_url,
    employmentType: product.employment_type,
    jobDescription: product.job_description,
    id: product.id,
    location: product.location,
    rating: product.rating,
    packagePerAnnum: product.package_per_annum,
    title: product.title,
    companyWebsiteUrl: product.company_website_url,
    skills: product.skills,
    lifeAtCompany: product.life_at_company,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData.job_details)
      const updatedSimilarProductsData = fetchedData.similar_jobs.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  retryjobItem = () => {
    this.getProductData()
  }

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Oops! Something Went Wrong</h1>

      <button onClick={this.retryjobItem} type="button" className="button">
        Retry
      </button>
      <p>We cannot seem to find the page you are looking for</p>
    </div>
  )

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductDetailsView = () => {
    const {productData, quantity, similarProductsData} = this.state
    const {
      title,
      companyLogoUrl,
      packagePerAnnum,
      location,
      jobDescription,
      employmentType,
      rating,
      id,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = productData

    //    console.log(productData)

    return (
      <div className="product-details-success-view">
        <div>
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="thumbnail"
          />
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
            <a href={companyWebsiteUrl}>Visit</a>
            <p className="desp">{jobDescription}</p>
            <h1>Skills</h1>
            <ul>
              {skills.map(i => (
                <li key={i.name}>
                  <img alt={i.name} src={i.image_url} />
                  <p>{i.name}</p>
                </li>
              ))}
            </ul>
            <h1>Life at Company</h1>
            <p>{lifeAtCompany.description}</p>
            <img alt="life at company" src={lifeAtCompany.image_url} />
          </div>
          <h1 className="similar-products-heading">Similar Jobs</h1>
          <ul className="similar-products-list">
            {similarProductsData.map(eachSimilarProduct => (
              <SimilarProductItem
                productDetails={eachSimilarProduct}
                key={eachSimilarProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
