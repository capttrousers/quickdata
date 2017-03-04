<template lang="pug">
  #help(style="text-align: center;")
    br(v-for="i in 5")
    span this will be the help section for the file upload feature
    md-layout
      md-button.md-raised.md-icon-button( @click.native="homeRouter")
        md-icon arrow_back
</template>

<script>
export default {

  methods: {
    homeRouter: function() {
      this.$router.push('/');
    }
  }
}
</script>

<style >
  #help {
    margin: 0 auto;
    width: 60%;
  }
  @media screen and (max-width: 1400px) {
    #form {
      width: 80%;
    }
  }
</style>
