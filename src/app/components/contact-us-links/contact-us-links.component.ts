import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us-links',
  standalone: true,
  imports: [],
  template: `
    <div
      class="w-full h-full flex justify-center items-center gap-16 z-10 relative"
    >
      <a
        class="w-10 h-10 rounded-full bg-[url('assets/logo/Facebook_Logo_Primary.png')] bg-no-repeat bg-center bg-contain cursor-pointer"
        href="https://www.facebook.com/groups/251334975285975"
      ></a>
      <a
        class="w-10 h-10 rounded-full bg-[url('assets/logo/Instagram_Glyph_Gradient.png')] bg-no-repeat bg-center bg-contain cursor-pointer"
        href="https://www.instagram.com/novus_crystal_life/"
      ></a>
      <a
        class="w-10 h-10 rounded-full bg-[url('/assets/logo/youtube_social_icon_red.png')] bg-no-repeat bg-center bg-contain cursor-pointer"
        href="https://www.youtube.com/@novus5113"
      ></a>
      <a
        class="w-10 h-10 rounded-full bg-[url('assets/logo/Podcasts_Logo.png')] bg-no-repeat bg-center bg-contain cursor-pointer"
        href="https://reurl.cc/KAnbry"
      ></a>
    </div>
  `,
  styles: `:host { width: 100%; height: 100%;}`,
})
export class ContactUsLinksComponent {}
