<template>
  <div>
    <div class="article-preview">
      <div class="article-meta">
        <a href=""><img src="http://i.imgur.com/Qr71crq.jpg"></a>
        <div class="info">
          <a href="" class="author">Eric Simons</a>
          <span class="date">January 20th</span>
        </div>
        <button class="btn btn-outline-primary btn-sm pull-xs-right">
          <i class="ion-heart" /> 29
        </button>
      </div>
      <n-link to="/article/how-to-build-webapps-that-scale" class="preview-link">
        <h1>How to build webapps that scale</h1>
        <p>This is the description for the post.</p>
        <span>Read more...</span>
      </n-link>
    </div>

    <div class="article-preview">
      <div class="article-meta">
        <a href=""><img src="http://i.imgur.com/N4VcUeJ.jpg"></a>
        <div class="info">
          <a href="" class="author">Albert Pai</a>
          <span class="date">January 20th</span>
        </div>
        <button class="btn btn-outline-primary btn-sm pull-xs-right">
          <i class="ion-heart" /> 32
        </button>
      </div>
      <n-link to="/article/the-song-you-wont-ever-stop-singing" class="preview-link">
        <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
        <p>This is the description for the post.</p>
        <span>Read more...</span>
        <ul class="tag-list">
          <li class="tag-default tag-pill tag-outline">
            Music
          </li>
          <li class="tag-default tag-pill tag-outline">
            Song
          </li>
        </ul>
      </n-link>
    </div>
  </div>
</template>
