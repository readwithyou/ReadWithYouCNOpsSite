<template>
  <footer class="footer">
    <div class="container">
        <nav>
            <ul>
              <li>
                <router-link :to="{path:'/dashboard'}">主页</router-link>
              </li>
                <li>
                    <a href="#">
                        Company
                    </a>
                </li>
                <li>
                    <a href="#">
                        Portfolio
                    </a>
                </li>
                <li>
                    <a href="#">
                        Blog
                    </a>
                </li>
            </ul>
        </nav>
        <div class="copyright text-center">
          &copy; {{ new Date().getFullYear() }} <a href="#" target="_blank">Read with You</a>, made with <i class="fa fa-heart heart"></i> for a better world
        </div>
    </div>
  </footer>

</template>
<script>
export default {}

</script>
<style>

</style>
