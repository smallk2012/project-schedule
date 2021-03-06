export default {
    routes: [
        {
            path: '/hello',
            name: 'HelloWorld',
            component: () => import('@/components/HelloWorld')
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/pages/Login')
        },
        {
            path: '/home',
            name: 'Home',
            component: () => import('@/pages/Home')
        },
        {
            path: '/excel',
            name: 'excel',
            component: () => import('@/pages/Excel')
        },
        {
            path: '*',
            redirect: {
                path: '/excel'
            }
        }
    ]
}
