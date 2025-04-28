
function SoundboardNavbar() {

}

function SoundboardItemList() {
    
}

function SoundboardEditItemDialog(viewRoot) {
  this.onSubmit = function(form, action) {
    if (!form.voice.value) return this.error = {message: "Please select a voice"}
    if (!form.text.value.trim()) return this.error = {message: "Please enter some text"}
    $(viewRoot).triggerHandler(action == "save" ? "save-item" : "test-item", {
      voice: voices[form.voice.value],
      volume: form.volume.value,
      rate: form.rate.value,
      pitch: form.pitch.value,
      text: form.text.value,
    })
  }
}

function Navbar() {
  this.brandText = "TTS Tool"
}
