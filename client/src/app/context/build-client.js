import axios from "axios";

export default ({ req }) => {
    if (typeof window === 'undefined') {
        console.log('**** build-client on server side ****');

        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req?.headers
        })
    } else {
        console.log('**** build-client on browser side  ****');
        return axios.create({
            baseUrl: '/',
        });
    }
}