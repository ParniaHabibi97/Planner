let timerSetup = {
    template: `
      <form>
           <label for="min">Minutes<br />
           <input type="number" v-model="minutes" name="time_m" id="min" min="0" max="59">
           </label>
           <label for="sec">Secondes<br />
                <input type="number" v-model="secondes" name="time_s" id="sec" max="59" min="0">
           </label>
           <button type="button" @click="sendTime">Set time</button>
      </form>`,
    data() {
      return {
        minutes: 0,
        secondes: 0 };
  
    },
    methods: {
      sendTime() {
        this.$emit('set-time', { minutes: this.minutes, secondes: this.secondes });
      } } };
  
  
  
  let Timer = {
    template: `
           <div class="timer">{{ time | prettify }}</div>
      `,
    props: ['time'],
    filters: {
      prettify: function (value) {
        let data = value.split(':');
        let minutes = data[0];
        let secondes = data[1];
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (secondes < 10) {
          secondes = "0" + secondes;
        }
        return minutes + ":" + secondes;
      } } };
  
  
  
  let app = new Vue({
    el: "#app",
    components: {
      'timer-setup': timerSetup,
      'timer': Timer },
  
    data: {
      isRunning: false,
      minutes: 0,
      secondes: 0,
      time: 0,
      timer: null,
      sound: new Audio("http://s1download-universal-soundbank.com/wav/nudge.wav") },
  
    computed: {
      prettyTime() {
        let time = this.time / 60;
        let minutes = parseInt(time);
        let secondes = Math.round((time - minutes) * 60);
        return minutes + ":" + secondes;
      } },
  
    methods: {
      start() {
        this.isRunning = true;
        if (!this.timer) {
          this.timer = setInterval(() => {
            if (this.time > 0) {
              this.time--;
            } else {
              clearInterval(this.timer);
              this.sound.play();
              this.reset();
            }
          }, 1000);
        }
      },
      stop() {
        this.isRunning = false;
        clearInterval(this.timer);
        this.timer = null;
      },
      reset() {
        this.stop();
        this.time = 0;
        this.secondes = 0;
        this.minutes = 0;
      },
      setTime(payload) {
        this.time = payload.minutes * 60 + payload.secondes;
      } } });