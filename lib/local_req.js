import axios from "axios"
import {showLoading,hideLoading } from "../components/PageLoading"

export default {
    Post: function (path, params, callback, disable_loading = false) {

        if (!disable_loading) {
            showLoading()
        }
       
        axios.post(path, params).then( (resp) => {

            if (!disable_loading) {
                hideLoading()
            }
            
            if (resp.status !== 200) {
                console.error("request "+path, params, " response:", resp)
                callback("req failed")
            } else {
                console.log(resp)
                if (resp.data.error) {
                    callback(resp.data.error)
                } else {
                    callback(null, resp.data.data)
                }
            }
        }).catch( err => {
            console.error("request "+path, params, " error:", err)
            callback(err)
        })
    }
}