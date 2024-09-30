import React from 'react';
import Footer from './Footer';
import Header from './Header'

const Home = () => {
    return (
        <>
            <Header />
            <div className="hero-wrap" style={{ backgroundImage: 'url("images/bg_2.jpg")' }} data-stellar-background-ratio="0.5">
                <div className="overlay"></div>
                <div className="overlay-2"></div>

                {/* Hero Content */}
                <div className="container">
                    <div className="row no-gutters slider-text justify-content-center align-items-center">
                        <div className="col-lg-8 col-md-6 ftco-animate d-flex align-items-end">
                            dasd
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar Section */}
            <div className="search-section py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-10">
                            <div className="search-wrap">
                                <div className="row">
                                    <div className="col-md-4">
                                        <input type="text" className="form-control" placeholder="Enter Location" />
                                    </div>
                                    <div className="col-md-3">
                                        <input type="date" className="form-control" placeholder="Check-in Date" />
                                    </div>
                                    <div className="col-md-3">
                                        <input type="date" className="form-control" placeholder="Check-out Date" />
                                    </div>
                                    <div className="col-md-2">
                                        <button className="btn btn-primary w-100">Search</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Essentials Section */}
            <div className="essentials-section py-5">
                <div className="container">
                    <h2 className="heading mb-4 text-center">Essentials in OYO Rooms</h2>
                    <div className="row justify-content-center text-center">
                        <div className="col-md-2 d-flex flex-column align-items-center">
                            <div className="essential-item">
                                <img src="my_img/ac.png" alt="AC Room" className="img-fluid mb-2" style={{ width: '15%' }} />
                                <p>AC Room</p>
                            </div>
                        </div>
                        <div className="col-md-2 d-flex flex-column align-items-center">
                            <div className="essential-item">
                                <img src="my_img/bed.png" alt="Spotless Linen" className="img-fluid mb-2" style={{ width: '15%' }} />
                                <p>Spotless Linen</p>
                            </div>
                        </div>
                        <div className="col-md-2 d-flex flex-column align-items-center">
                            <div className="essential-item">
                                <img src="my_img/wifi.png" alt="Free Wifi" className="img-fluid mb-2" style={{ width: '15%' }} />
                                <p>Free Wifi</p>
                            </div>
                        </div>
                        <div className="col-md-2 d-flex flex-column align-items-center">
                            <div className="essential-item">
                                <img src="my_img/washroom.png" alt="Clean Washroom" className="img-fluid mb-2" style={{ width: '15%' }} />
                                <p>Clean Washroom</p>
                            </div>
                        </div>
                        <div className="col-md-2 d-flex flex-column align-items-center">
                            <div className="essential-item">
                                <img src="my_img/tv.png" alt="TV" className="img-fluid mb-2" style={{ width: '15%' }} />
                                <p>TV</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Featured Hotels Section */}
            <div className="featured-hotels py-5 bg-light">
                <div className="container">
                    <div className="row mb-4" >
                        <div className="col-12">
                            <h2 className="heading">Featured Properties of the Month</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="hotel-wrap">
                                <img src="https://images.oyoroomscdn.com/uploads/hotel_image/101742/medium/9d1a96cae3315d7f.jpg" className="img-fluid" alt="Hotel 1" />
                                <div className="text p-3 text-center">
                                    <h3><a href="#">Hotel 1</a></h3>
                                    <p className="price"><span>$99</span> / night</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="hotel-wrap">
                                <img src="https://images.oyoroomscdn.com/uploads/hotel_image/223187/medium/2402f84aa8113521.jpg" className="img-fluid" alt="Hotel 2" />
                                <div className="text p-3 text-center">
                                    <h3><a href="#">Hotel 2</a></h3>
                                    <p className="price"><span>$120</span> / night</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="hotel-wrap">
                                <img src="https://images.oyoroomscdn.com/uploads/hotel_image/86866/medium/2b548ba5156d452b.jpg" className="img-fluid" alt="Hotel 3" />
                                <div className="text p-3 text-center">
                                    <h3><a href="#">Hotel 3</a></h3>
                                    <p className="price"><span>$150</span> / night</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="hotel-wrap">
                                <img src="https://images.oyoroomscdn.com/uploads/hotel_image/75028/medium/df1570a0afee8658.JPG" className="img-fluid" alt="Hotel 4" />
                                <div className="text p-3 text-center">
                                    <h3><a href="#">Hotel 4</a></h3>
                                    <p className="price"><span>$150</span> / night</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Popular Destinations */}
            <div className="popular-destinations py-5">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-12 ">
                            <h2 className="heading">Popular Cities</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="destination">
                                <img src="https://assets.oyoroomscdn.com/cmsMedia/5e7b5497-177f-407a-ae42-0ac00f1ca58c.jpg" className="img-fluid" alt="Destination" />
                                <div className="text p-3 text-center">
                                    <h3><a href="#">Da Nang</a></h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="destination">
                                <img src="https://assets.oyoroomscdn.com/cmsMedia/e2493d7f-8271-47d8-9bc0-035fd2208988.jpg" className="img-fluid" alt="Destination" />
                                <div className="text p-3 text-center">
                                    <h3><a href="#">Ho Chi Minh</a></h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="destination">
                                <img src="https://assets.oyoroomscdn.com/cmsMedia/c3fe6bc9-64da-4961-95c4-d310006e6c25.jpg" className="img-fluid" alt="Destination" />
                                <div className="text p-3 text-center">
                                    <h3><a href="#">Ha Noi</a></h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="destination">
                                <img src="https://assets.oyoroomscdn.com/cmsMedia/1d317ea8-7426-4324-9033-a5eedbb4e147.jpg" className="img-fluid" alt="Destination" />
                                <div className="text p-3 text-center">
                                    <h3><a href="#">Phu Quoc</a></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />

            <style jsx>{`
                .hero-wrap {
                    position: relative;
                    height: 80vh;
                    background-size: cover;
                    background-position: center center;
                    display: flex;
                    align-items: center;
                }
                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.3);
                }
                .overlay-2 {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                }
                .search-section {
                    background: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .hotel-wrap, .destination {
                    background: #fff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                }
                .hotel-wrap .text, .destination .text {
                    padding: 20px;
                }

                .featured-hotels .heading {
    text-align: left; /* Aligns text to the left */
    margin-bottom: 20px; /* Space below the heading */
    font-size: 2rem; /* Adjust font size as needed */
    font-weight: bold; /* Make it bold */
}

.popular-destinations .heading {
    text-align: left; /* Aligns text to the left */
    margin-bottom: 20px; /* Space below the heading */
    font-size: 2rem; /* Adjust font size as needed */
    font-weight: bold; /* Make it bold */


            `}</style>
        </>
    );
};

export default Home;
