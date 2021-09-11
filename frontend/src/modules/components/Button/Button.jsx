function Button() {
  const handleClick = function(){
    props.handleClick();
  }

  return (
    <button className={buttonClasses.concat('button')} id={props.buttonId || ""} onClick={handleClick()}>
        {props.buttonContent}
    </button>
  )
}

export default Button
