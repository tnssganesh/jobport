import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'

import './index.css'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.initial,
    activeCategoryId: [],
    searchInput: '',
    activeRatingId: '',
    profile: '',
    profileStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
    this.getPofile()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {
      activeOptionId,
      activeCategoryId,
      searchInput,
      activeRatingId,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeCategoryId.join(
      ',',
    )}&minimum_package=${activeRatingId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(product => ({
        companyLogoUrl: product.company_logo_url,
        employmentType: product.employment_type,
        jobDescription: product.job_description,
        id: product.id,
        location: product.location,
        rating: product.rating,
        packagePerAnnum: product.package_per_annum,
        title: product.title,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  clearFilters = () => {
    this.setState(
      {
        searchInput: '',
        activeCategoryId: '',
        activeRatingId: '',
      },
      this.getProducts,
    )
  }

  changeRating = activeRatingId => {
    this.setState({activeRatingId}, this.getProducts)
  }

  changeCategory = activeCategory => {
    const {activeCategoryId} = this.state
    if (activeCategoryId.includes(activeCategory)) {
      const newlist = activeCategoryId.filter(i => i !== activeCategory)
      this.setState({activeCategoryId: newlist}, this.getProducts)
    } else if (activeCategoryId !== '') {
      this.setState(
        {activeCategoryId: [...activeCategoryId, activeCategory]},
        this.getProducts,
      )
      //  console.log(activeCategory, activeCategoryId)
    } else {
      this.setState({activeCategoryId: activeCategory}, this.getProducts)
      // console.log(activeCategory)
    }
  }

  enterSearchInput = () => {
    this.getProducts()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  retryJobs = () => {
    this.getProducts()
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for
      </p>

      <button onClick={this.retryJobs} type="button">
        Retry
      </button>
    </div>
  )

  renderProductsListView = () => {
    const {productsList, activeOptionId} = this.state
    const shouldShowProductsList = productsList.length > 0

    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
          className="no-products-img"
          alt="no jobs"
        />
        <h1 className="no-products-heading">No Jobs Found</h1>
        <p className="no-products-description">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfileListView = () => {
    const {profile} = this.state
    return (
      <div>
        <img alt="profile" src={profile.profileImageUrl} />
        <h1>{profile.name}</h1>

        <p>{profile.shortBio}</p>
      </div>
    )
  }

  retryProfile = () => {
    this.getPofile()
  }

  renderFailureProfileView = () => (
    <button onClick={this.retryProfile} type="button">
      Retry
    </button>
  )

  renderProfile = () => {
    const {profileStatus} = this.state

    switch (profileStatus) {
      case apiStatusConstants.success:
        return this.renderProfileListView()
      case apiStatusConstants.failure:
        return this.renderFailureProfileView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  getPofile = async () => {
    this.setState({
      profileStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedprofile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profile: updatedprofile,
        profileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileStatus: apiStatusConstants.failure})
    }
  }

  render() {
    const {activeCategoryId, searchInput, activeRatingId} = this.state
    // console.log(activeCategoryId)

    return (
      <div className="all-products-section">
        <Header />
        <FiltersGroup
          renderProfile={this.renderProfile}
          searchInput={searchInput}
          employmentTypesList={employmentTypesList}
          salaryRangesList={salaryRangesList}
          changeSearchInput={this.changeSearchInput}
          enterSearchInput={this.enterSearchInput}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          changeCategory={this.changeCategory}
          changeRating={this.changeRating}
          clearFilters={this.clearFilters}
        />
        {this.renderAllProducts()}
      </div>
    )
  }
}

export default Jobs
