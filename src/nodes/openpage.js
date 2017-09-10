/**
 * @file openpage node 用于在headless里打开页面的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import puppeteer from 'puppeteer';

export default class OpenPage extends Node {

    static type = 'openpage';

    // 注册chrome的service
    static services = ['chrome'];


    async exec(param) {
        super.exec(param);

        let url = param;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url, {waitUntil: 'networkidle'});

        this.registerService('chrome', page);

        return new ReturnValue(0, null, this);
    }
}
