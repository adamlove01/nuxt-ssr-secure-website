<template>
  <v-container class="bg_white_geometric" fluid>
    <v-container class="pt-8">
      <v-card
        class="mx-auto px-2 py-3 rounded-lg"
        max-width="600"
        elevation="8"
      >
        <v-card-title class="text-h4 justify-center mb-3"> Vocode</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-textarea
              id="text"
              ref="text"
              v-model="textBox"
              spellcheck="false"
              outlined
              name="input-7-4"
              placeholder="type here ..."
              value=""
              @keydown="vocodeKeydown"
            ></v-textarea>
            <div class="btn-group d-flex">
              <v-btn
                small
                class="mt-0"
                color="blue darken-2"
                dark
                @click="copyText"
              >
                Copy
              </v-btn>
              <p class="ml-3 mt-1">{{ copied }}</p>
              <v-spacer></v-spacer>
              <p class="mr-3 mt-1">{{ modeLabel }}</p>
              <v-switch v-model="mode" class="switch"></v-switch>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
export default {
  middleware: 'authorize',
  data() {
    return {
      mode: true,
      textBox: '',
      copied: '',
    }
  },

  head: {
    title: 'Vocode | Your Website',
  },

  computed: {
    /** Change the mode toggle text */
    modeLabel() {
      this.$nextTick(() => this.$refs.text.focus())
      return this.mode ? 'Vocode' : 'English'
    },
  },

  methods: {
    /** Copy text in the textarea using the 'Copy' button */
    copyText() {
      const id = document.getElementById('text')
      if (id.value) {
        const start = id.selectionStart
        const end = id.selectionEnd
        id.focus()
        id.select()
        document.execCommand('copy')

        /** Reset selection position */
        id.selectionStart = start
        id.selectionEnd = end

        this.copied = 'Copied!'
      } else {
        this.copied = 'Nothing to copy'
      }

      /** Hide 'Copied!' text after a moment */
      /** setTimeout must use '=>' otherwise 'this' is not recognized */
      setTimeout(() => {
        this.copied = ''
      }, 1500)
    },

    /** Replace text in textarea */
    vocodeKeydown(e) {
      const el = e.currentTarget
      const startPos = el.selectionStart ? el.selectionStart : 0
      let key = e.key || e.keyCode

      /** Change mode when user presses Shift + Enter */
      if (e.shiftKey && key === 'Enter') {
        e.preventDefault()
        this.mode = !this.mode
        return
      }

      /** Skip when user presses Ctrl or Command key */
      if (e.ctrlKey || e.metaKey || !this.mode) return

      let prevChar = ''
      let prevMatch = ''
      let newChar = ''
      let removeChars = 0

      // prettier-ignore
      const match =
        "AEOUSZRNaeouszrnQqCcBDFGKLMNPVWXYTtHhIiJj;'?.:!6789`\\-".indexOf(key)

      if (match > -1 && match <= 53) {
        if (match <= 15) {
          /** Set AEOUSZRNaeouszrn : Double-key ee, oo, etc for long vowels */
          if (match <= 7) {
            key = key.toLowerCase()
            newChar = key
          }
          prevChar = el.value.slice(startPos - 1, startPos)
          prevMatch = prevChar ? 'aeouszrn'.indexOf(prevChar) : 0
          if (prevChar === key) {
            newChar = 'áéóúśźŕń'.charAt(prevMatch)
            removeChars = 1
          }
        } else if (match <= 17) {
          /** Set Qq : Symbol for a, an, 'u,ü' unaccented at start/end of words */
          newChar = '•'
        } else if (match <= 19) {
          /** Set Cc : Symbol for 'the' */
          newChar = 'Ŧ'
        } else if (match <= 32) {
          /** Set BDFGKLMNPVWXY : Change to lowercase only */
          newChar = key.toLowerCase()
        } else if (match <= 34) {
          /** Set Tt : Double-key tt for 'th' */
          if (match === 33) {
            key = key.toLowerCase()
            newChar = key
          }
          prevChar = el.value.slice(startPos - 1, startPos)
          if (prevChar === 't') {
            newChar = 'th'
            removeChars = 1
          }
        } else if (match <= 36) {
          /** Set Hh : Double-key hh for 'tħ'  */
          if (match === 35) {
            key = key.toLowerCase()
            newChar = key
          }
          prevChar = el.value.slice(startPos - 1, startPos)
          if (prevChar === 'h') {
            newChar = 'tħ'
            removeChars = 1
          }
        } else if (match <= 38) {
          /** Set Ii : i symbol with no dot ; Double-key ii for long vowel */
          newChar = 'ı'
          prevChar = el.value.slice(startPos - 1, startPos)
          if (prevChar === 'ı') {
            newChar = 'í'
            removeChars = 1
          }
        } else if (match <= 40) {
          /** Set Jj : j symbol with no dot */
          newChar = 'ȷ'
        } else if (match <= 41) {
          /**
           * Set ; : [Character + semi-colon] combo for special characters ħäü
           * else  : Change to colon (without shift)
           */
          prevChar = el.value.slice(startPos - 1, startPos)
          prevMatch = prevChar ? 'hau'.indexOf(prevChar) : 0
          if (prevMatch > -1) {
            newChar = 'ħäü'.charAt(prevMatch)
            removeChars = 1
          } else {
            if (parseInt(prevChar) || prevChar === 0 || prevChar == ':') {
              newChar = ':'
            } else {
              newChar = prevChar === ' ' ? '::' : ' ::'
            }
          }
        } else if (match <= 42) {
          /** Set ' : Change to " (there is no single-quote) */
          newChar = '"'
        } else if (match <= 43) {
          /** Set ? : Add space on left side of punctuation */
          prevChar = el.value.slice(startPos - 1, startPos)
          newChar = prevChar === ' ' || prevChar === '?' ? '?' : ' ?'
        } else if (match <= 46) {
          /** Set .:! : Add space on left side of punctuation */
          prevChar = el.value.slice(startPos - 1, startPos)
          console.log('prevChar=', prevChar)
          if (parseInt(prevChar) || prevChar === '0' || prevChar === key) {
            newChar = key
          } else {
            newChar = prevChar === ' ' ? `${key}${key}` : ` ${key}${key}`
          }
        } else if (match <= 47) {
          /** Set 6 : Change to left-brace (without shift) */
          newChar = '('
        } else if (match <= 48) {
          /** Set 7 : Change to right-brace (without shift) */
          newChar = ')'
        } else if (match <= 49) {
          /** Set 8 : Change to exclamation (without shift) */
          prevChar = el.value.slice(startPos - 1, startPos)
          if (parseInt(prevChar) || prevChar === '0' || prevChar == '!') {
            newChar = '!'
          } else {
            newChar = prevChar === ' ' ? '!!' : ' !!'
          }
        } else if (match <= 50) {
          /** Set 9 : Change to question mark (without shift) */
          prevChar = el.value.slice(startPos - 1, startPos)
          newChar = prevChar === ' ' || prevChar === '?' ? '?' : ' ?'
        } else if (match <= 51) {
          /** Set ` : Change to + (without shift) */
          newChar = '+'
        } else if (match <= 52) {
          /** Set \ : Change to | (without shift) */
          newChar = '|'
        } else if (match <= 53) {
          /** Set - : Double-key '--' for '–' (en-dash)  */
          prevChar = el.value.slice(startPos - 1, startPos)
          if (prevChar === '-') {
            newChar = '–'
            removeChars = 1
          }
        }
      }

      if (newChar) {
        e.preventDefault()
        const caratPos = startPos + newChar.length - removeChars
        el.value =
          el.value.slice(0, startPos - removeChars) +
          newChar +
          el.value.slice(startPos, el.value.length)
        el.focus()
        el.setSelectionRange(caratPos, caratPos)
      }
    },
  },
}
</script>
<style>
.v-textarea textarea {
  font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui,
    helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif;
}

.v-input--selection-controls__input:hover
  .v-input--selection-controls__ripple:before {
  background: transparent !important;
}

.v-input--selection-controls__input
  .v-input--selection-controls__ripple
  .v-ripple__container {
  display: none !important;
}
.btn-group {
  height: 30px;
}
.switch {
  margin-top: 1px;
}
</style>
