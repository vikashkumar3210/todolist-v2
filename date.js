
exports.getDate = function(){
  const x= new Date();
  const option={
    weekday:"long",
    day:"numeric",
        month:"long" ,
  }
  return x.toLocaleDateString("en-US" , option);

}
