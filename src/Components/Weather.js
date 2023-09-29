import { useState, useEffect, useRef } from 'react';
import React from 'react';
import Container from './Container';
import Loading from './Loading';
import axios from 'axios';
import RecentBox from './RecentBox';
export default function Weather(props) {
    const [data, setData] = useState([]);
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [city, setCity] = useState("");
    const [recent, setRecent] = useState([]);
    let icon;
    const cityNameInput = useRef();
    const errorBox = useRef()
    useEffect(
        () => {
            getLocation()
            let localRecent = localStorage.getItem("localRecent");
            if (localRecent !== null) {
                localRecent = JSON.parse(localRecent);
                setRecent(localRecent);
            }

            // getData();
        },
        []
    )
    useEffect(
        () => {
            getData(0)
        },
        [lat, long]
    )

    useEffect(
        () => {
            if (data.length !== 0) {
                storeRecent(data)
            }
        },
        [data]
    )
    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLong(position.coords.longitude);
            },
            (error) => {
                console.log(error)
            }
        )
    }
    const researchRecent = (lat, lon) => {
        setLat(lat)
        setLong(lon)
    }
    const cityNameHandler = (event) => {
        setCity(event.target.value);
    }
    const getIconUrl = () => {
        const icon = data.weather[0].icon;
        return <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="" />
    }
    const storeRecent = (data) => {
        const flag = recent.some(
            (recentItem) => {
                return (recentItem.lat === data.coord.lat) && (recentItem.lon === data.coord.lon)
            }
        )
        const obj = {
            name: data.name,
            lat: data.coord.lat,
            lon: data.coord.lon
        }
        if (!flag) {
            const newRecent = recent;
            newRecent.push(obj)
            setRecent(newRecent)
            localRecent()
        }
        props.recentDbHandler(obj);
    }
    const localRecent = () => {
        localStorage.setItem("localRecent", JSON.stringify(recent))
    }
    // if(recent.length > )
    const getData = async (cityFlag) => {
        if (cityFlag === 1) {
            axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=21805bff7224936fa25d6cec016a0a4b`
            ).then(
                (res) => {
                    // console.log(res);
                    const apiRes = res.data;
                    setCity(apiRes.name)
                    setData(apiRes)
                    createError("")
                }
            ).catch(
                (error) => {
                    createError(`Data not found for ${city}`)
                }
            )

        } else {
            if (lat !== "" && long !== "") {
                axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=21805bff7224936fa25d6cec016a0a4b`
                ).then(
                    (res) => {
                        setCity(res.data.name)
                        setData(res.data);
                    }
                )
            }
        }
    }
    const createError = (msg) => {
        errorBox.current.innerText = msg;
    }
    const searchByCity = () => {
        if (city !== "") {
            getData(1)
            createError("");
        } else {
            cityNameInput.current.focus()
            createError("Please enter the city name")
        }
    }
    return (
        <>
            <Container>
                <div className="col-6 offset-3">
                    <div className="mb-3">
                        <label htmlFor="" className="form-label">City Name</label>
                        <input type="text" name="" id="" className="form-control"
                            onChange={cityNameHandler} value={city} placeholder="" ref={cityNameInput} />
                        <div className='my-2'>
                            <button className='btn btn-primary' onClick={searchByCity}>Search</button>
                        </div>
                        <small id="helpId" className="text-danger" ref={errorBox}></small>
                    </div>
                </div>
            </Container>
            {
                data.length === 0
                    ?
                    <>
                        <Loading classData="col-6 offset-3 text-center mt-5" />
                    </>
                    :
                    <>
                        <Container>
                            <div className="col-6 offset-3 text-center bg-primary text-white p-2 rounded">
                                <h2>{data.name}</h2>
                            </div>
                        </Container>
                        <Container>
                            <div className="col-6 offset-3 border border-primary text-center p-2 rounded">
                                {data.weather[0].description}
                                {getIconUrl()}
                            </div>
                        </Container>
                        <Container>

                            <div className="col-6 offset-3 bg-dark text-white p-2 rounded">
                                <div className="row">
                                    <div className="col-6">
                                        Temp: {data.main.temp} deg
                                    </div>
                                    <div className="col-6">
                                        Humidity: {data.main.humidity} %
                                    </div>
                                    <div className="col-6">
                                        Sunrise : {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
                                    </div>
                                    <div className="col-6">
                                        Sunset : {new Date(data.sys.sunset * 1000).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        </Container>
                        <RecentBox recentData={recent} handler={researchRecent} />
                    </>
            }
        </>);
}
