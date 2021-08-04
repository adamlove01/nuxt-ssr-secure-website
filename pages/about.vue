<template>
  <div>
    <SectionText
      title="Who We Are"
      sub-title="
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dapibus, neque non eleifend dignissim, lectus odio semper erat, sed blandit mauris augue sed lorem. Sed eu sem at odio venenatis euismod vestibulum id neque. In a tellus venenatis, consequat ex at, placerat massa. Pellentesque gravida felis maximus, lacinia augue volutpat, luctus sem. Duis id magna pretium, volutpat risus laoreet, suscipit ante.
      </p> 
      <p>
        Duis sed ultricies nisl, ac placerat nisi. Aliquam elementum mauris dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ante mi, pellentesque a magna nec, tincidunt rutrum ex. Mauris consectetur, lacus ut auctor sollicitudin, justo urna posuere ex, quis congue tortor lorem ut erat.
      </p>"
      background-image="/img/bg_office.png"
    ></SectionText>
    <SectionText
      title="What We Do"
      sub-title="
      <p>
        Nullam porttitor lorem in diam vestibulum, nec aliquet dolor vestibulum. Fusce dictum purus id vehicula viverra. In elementum diam sit amet diam efficitur, sit amet pellentesque leo congue. Praesent lacinia sed nisl sit amet interdum. Maecenas rhoncus sed ex nec vulputate. Phasellus ut neque ut tellus scelerisque lobortis. Nulla vel magna leo. Etiam ac faucibus augue. Integer bibendum lorem ligula, fermentum suscipit nisi placerat in.
      </p>
      <p>
        In sapien tellus, mattis vel nulla quis, scelerisque porttitor leo. Proin vitae tincidunt nisi. Nam pretium nisl at dapibus condimentum. Mauris eu velit maximus, tristique purus eu, tristique lacus. Aliquam efficitur dapibus lacus, eget convallis ligula faucibus ac. Donec id lobortis metus. Fusce suscipit imperdiet scelerisque.
      </p>"
    ></SectionText>
    <SectionTeamImages
      title="Our Team"
      :cards="sectionTeamImages"
      background-image="/img/bg_white_geometric.jpg"
    ></SectionTeamImages>
  </div>
</template>

<script>
export default {
  middleware: 'authorize',

  data() {
    return {
      sectionTeamImages: [
        {
          title: 'Bill Lumbergh',
          subTitle: 'Vice President',
          image: '/img/users/male.png',
        },
        {
          title: 'Bob Slydell',
          subTitle: 'Business Consultant',
          image: '/img/users/male.png',
        },
        {
          title: 'Bob Porter',
          subTitle: 'Business Consultant',
          image: '/img/users/male.png',
        },
        {
          title: 'Peter Gibbons',
          subTitle: 'Programmer',
          image: '/img/users/male.png',
        },
        {
          title: 'Milton Waddams',
          subTitle: 'Collator',
          image: '/img/users/male.png',
        },
        {
          title: 'Joanna',
          subTitle: 'Flair',
          image: '/img/users/female.png',
        },
      ],
    }
  },
}
</script>
