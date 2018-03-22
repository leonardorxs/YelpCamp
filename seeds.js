var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment");
    
var data = [
    {
      name: "Cloud's Rest", 
      image: "https://pixabay.com/get/e136b80728f31c2ad65a5854ee4d459fe270e7c818b4134192f4c67ba0eb_340.jpg",
      description: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker."
    },
    {
      name: "Any name", 
      image: "https://media-cdn.tripadvisor.com/media/photo-s/03/de/f2/f0/cloud-farm-camping.jpg",
      description: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker."
    },
    {
      name: "Canyon Floor", 
      image: "http://www.utahoutside.com/wp-content/uploads/2012/06/IMG_7721-640x427.jpg",
      description: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker."
    }
  ];
function seedDB(){
  // remove all campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log("Removed Campgrounds!");
      
    //add a few campgrounds
    data.forEach(function(seed){
      Campground.create(seed, function(err, campground){
        if(err){
          console.log(err);
        } else {
          console.log("Added a campground!");
          //add a few comments
          Comment.create(
            {
              text: "This place is great, but i wish it was internet",
              author: "Homer"
            }, function(err, comment){
              if(err){
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("Created new comment");
              }
            });
        }
    });
  });
});
  
  
}

module.exports = seedDB;