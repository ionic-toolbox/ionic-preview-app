import { Component, NgZone, ViewChild }	from '@angular/core';
import { Config, Menu, Platform }		from 'ionic-angular';
import { NavController }				from 'ionic-angular';

import * as helpers						from '../directives/helpers';
import { PageOne, PageTwo, PageThree }	from '../pages/menus/basic/pages';
import { BasicPage }					from '../pages/action-sheets/basic/basic';

@Component({
	templateUrl: 'app.html'
})
export class PreviewApp {
	isProductionMode: boolean = false;
	isLab: boolean = false;
	rootPage: any;
	nextPage: any;
	currentPlatform: string = 'ios';
	currentPageIndex: number = 1;

	@ViewChild('content') content: NavController;
	@ViewChild(Menu) menu: Menu;

	pages = [
		{ title: 'Home', component: PageOne },
		{ title: 'Friends', component: PageTwo },
		{ title: 'Events', component: PageThree }
	];

	constructor(public platform: Platform, public config: Config, public zone: NgZone) {
		var prefix = 'PreviewApp::constructor: '
		console.log(prefix);

		this.rootPage = BasicPage;
	}

	ngAfterContentInit() {
		var prefix = 'PreviewApp::ngAfterContentInit: '
		console.log(prefix);

		// if viewing the preview app in lab, hide the statusbars
		this.isLab = window.parent.location.pathname === '/ionic-lab';
		if (this.isLab) this.config.set('statusbarPadding', false);

		if (this.platform.getQueryParam('production') === 'true') {
			this.isProductionMode = true;

			console.log(prefix + 'isProductionMode=' + this.isProductionMode);

			if (this.platform.is('android')) {
				this.currentPlatform = 'android';
			} else if (this.platform.is('windows')) {
				this.currentPlatform = 'windows';
			}

			if (helpers.hasScrollbar() === true) {
				setTimeout(function () {
					var body = document.getElementsByTagName('body')[0];
					body.className = body.className + ' has-scrollbar';
				}, 500);
			}

			/*
			window.parent.postMessage(this.currentPlatform, '*');
			window.addEventListener('message', (e) => {
				this.zone.run(() => {
					if (e.data) {
						var data;
						try {
							data = JSON.parse(e.data);
						} catch (e) {
							console.error(e);
						}

						if (data.hash) {
							this.nextPage = helpers.getPageFor(data.hash.replace('#', ''));
							if (data.hash !== 'menus') {
								this.menu.close()
								this.menu.enable(false);
							}
							console.log(prefix + 'next page=' + this.nextPage);

						} else {
							console.log(prefix + 'return to basic page');

							this.currentPageIndex = 1;
							this.nextPage = BasicPage;
						}

						setTimeout(() => {
							helpers.debounce(this.content.setRoot(this.nextPage), 60, false);
						});
					}
				});
			});
			*/
		}
	}

	previousSection() {
		var prefix = 'PreviewApp::previousSection: '
		console.log(prefix);

		let previousPage = this.currentPageIndex - 1;
		if (previousPage < 0) {
			previousPage = 0;
		}
		let pageName = Object.keys(helpers.getPages())[previousPage];
		this.content.setRoot(helpers.getPageFor(pageName), {}, { animate: false });
		this.currentPageIndex = previousPage;
	}

	nextSection() {
		var prefix = 'PreviewApp::nextSection: '
		console.log(prefix);

		let nextPage = this.currentPageIndex + 1;
		const pageList = Object.keys(helpers.getPages());
		if (nextPage >= pageList.length) {
			nextPage = pageList.length - 1;
		}
		let pageName = pageList[nextPage];
		this.content.setRoot(helpers.getPageFor(pageName), {}, { animate: false });
		this.currentPageIndex = nextPage;
	}

	openPage(page) {
		var prefix = 'PreviewApp::openPage: '
		console.log(prefix + 'page=' + page.component);

		helpers.debounce(this.content.setRoot(page.component), 60, false);
	}
}
