/**
 * Менеджер редактора xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.panel.main.xml.Manager',
    {
        requires: [
            'FBEditor.view.panel.main.xml.proxy.Editor'
        ],

        statics: {
            /**
             * Возвращает менеджер.
             * @property {FBEditor.view.panel.main.xml.Manager}
             */
            getInstance: function ()
            {
                return FBEditor.view.panel.main.xml.Manager.self;
            },

            /**
             * @private
             * @property {FBEditor.view.panel.main.xml.Manager}
             */
            self: null
        },

        /**
         * @private
         * @property {FBEditor.view.panel.main.editor.Manager} Менеджер редактора текста.
         */
        managerEditor: null,

        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.proxy.Editor} Прокси для работы со сторонним редактором xml.
         */
        proxyEditor: null,

        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.Xml} Панель редактора xml.
         */
        panel: null,

        /**
         * @private
         * @property {FBEditor.editor.element.AbstractElement} Текущий редактируемый элемент в редакторе xml.
         */
        el: null,

        /**
         * @private
         * @property {String} Хранит исходный xml, который был передан редактору.
         */
        srcXml: null,

        translateText: {
            invalidXml: 'Невалидный XML',
            invalidXmlMsg: 'Покинуть редактор XML без сохранения всех изменений?'
        },

        /**
         * @param {FBEditor.view.panel.main.editor.Editor} managerEditor Менеджер редактора текста.
         */
        constructor: function (managerEditor)
        {
            var me = this;

            // сохраняем ссылку в статической переменной для последующего обращения к менеджеру через #getInstance
            FBEditor.view.panel.main.xml.Manager.self = me;

            me.managerEditor = managerEditor;

            // прокси для работы со сторонним редактором xml
            me.proxyEditor = Ext.create('FBEditor.view.panel.main.xml.proxy.Editor');
        },

        /**
         * Возврщает менеджер редактора текста.
         * @return {FBEditor.view.panel.main.editor.Manager}
         */
        getManagerEditor: function ()
        {
            return this.managerEditor;
        },

        /**
         * Возвращает прокси для работы со сторонним редактором xml.
         * @return {FBEditor.view.panel.main.xml.proxy.Editor}
         */
        getProxyEditor: function ()
        {
            return this.proxyEditor;
        },

        /**
         * Возвращает ткущий редактируемый элемент.
         * @return {FBEditor.editor.element.AbstractElement}
         */
        getElement: function ()
        {
            return this.el;
        },

        /**
         * Устанавливает исходный xml, который передается в редактор.
         * @param {String} xml
         */
        setSrcXml: function (xml)
        {
            this.srcXml = xml;
        },

        /**
         * Загружает данные в редактор xml.
         * @param {FBEditor.editor.element.AbstractElement} [el] Элемент.
         */
        loadData: function (el)
        {
            var me = this,
                managerEditor = me.getManagerEditor(),
                content = managerEditor.getContent(),
                panel = me.getPanel(),
                xml;

            el = el || content;
            me.el = el;

            // получаем xml
            xml = el.getXml();

            // загружаем в панель
            panel.fireEvent('loadData', xml);
        },

        /**
         * Проверяет и синхронизирует xml с текстом.
         * @resolve {Boolean} true - синхронизация успешна.
         * @return {Promise}
         */
        sync: function ()
        {
            var me = this,
                promise;

            promise = new Promise(
                function (resolve, reject)
                {
                    var proxy = me.getProxyEditor(),
                        managerEditor = me.getManagerEditor(),
                        el = me.getElement(),
                        srcXml = me.srcXml,
                        content,
                        scopeData,
                        schema,
                        root,
                        xml;

                    // получаем текущий xml из редактора
                    xml = proxy.getData();

                    if (xml !== srcXml)
                    {
                        // xml изменился

                        // временно устанавливаем xml элемента
                        el.setXml(xml);

                        // получаем xml всего тела книги с учетом xml измененного элемента
                        root = managerEditor.getContent();
                        xml = root.getXml();

                        // удаляем временный xml элемента
                        el.setXml(null);

                        try
                        {
                            xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;

                            scopeData = {
                                resolve: resolve,
                                fullXml: xml
                            };

                            // получаем модель для измененного xml
                            content = managerEditor.getModelFromXml(xml);
                            scopeData.content = content;

                            // получаем xml новой модели для проверки по схеме
                            xml = content.getXml(true);

                            schema = managerEditor.getSchema();

                            // проверяем по схеме
                            schema.validXml(
                                {
                                    xml: xml,
                                    callback: me.verifyResult,
                                    scope: me,
                                    scopeData: scopeData
                                }
                            );
                        }
                        catch (e)
                        {
                            me.errorValidMessage(e, resolve);
                        }
                    }
                    else
                    {
                        resolve(true);
                    }
                }
            );

            return promise;
        },

        /**
         * Обновляет дерево навигации по xml.
         */
        updateTree: function ()
        {
            var me = this,
                managerEditor = me.getManagerEditor(),
                data = managerEditor.getContent(),
                panel = me.getPanelNavigation();

            panel.loadData(data);
        },

        /**
         * Возвращает панель редактора xml.
         * @return {FBEditor.view.panel.main.xml.Xml}
         */
        getPanel: function ()
        {
            var me = this;

            me.panel = me.panel || Ext.getCmp('main-xml');

            return me.panel;
        },

        /**
         * Возвращает дерево навигации.
         * @return {FBEditor.view.panel.treenavigation.xml.Tree}
         */
        getPanelNavigation: function ()
        {
            var me = this,
                bridge = FBEditor.getBridgeNavigation(),
                panel;

            panel = bridge.Ext && bridge.Ext.getCmp && bridge.Ext.getCmp('panel-xml-navigation') ?
                bridge.Ext.getCmp('panel-xml-navigation') : null;

            return panel;
        },

        /**
         * Включает/отключает перенос длинных строк.
         * @param {Boolean} wrap true - включить перенос.
         */
        lineWrap: function (wrap)
        {
            var me = this,
                proxy = me.getProxyEditor();

            // устанавливаем перенос
            proxy.setLineWrap(wrap);
        },

        /**
         * @private
         * Результат проверки xml.
         * @param {Boolean} res true - xml валиден.
         * @param {Object} resData Данные.
         * @param {Function} resData.resolve Колбэк.
         * @param {Object} resData.response Дополнительные данные проверки xml.
         */
        verifyResult: function (res, resData)
        {
            var me = this,
                response = resData.response,
                managerEditor = me.getManagerEditor(),
                e;

            //console.log('verifyResult', res, resData);
            //console.log(response.xml);

            try
            {
                if (!res)
                {
                    e = new Error();
                    e.error = response.valid;

                    me.errorValidMessage(e, resData.resolve);
                }
                else
                {
                    // устанавливаем новый xml
                    managerEditor.setXml(resData.fullXml);

                    // устанавливаем новый контент
                    managerEditor.updateContent(resData.content);

                    resData.resolve(true);
                }
            }
            catch (e)
            {
                me.errorValidMessage(e, resData.resolve);
            }
        },

        /**
         * @private
         * показывает сообщение об ошибке валидации XML.
         * @param {Error} e Объект ошибки.
         * @param {String} e.error Отредактированное сообщение об ошибке.
         * @param {Function} resolve Колбэк.
         */
        errorValidMessage: function (e, resolve)
        {
            var me = this,
                tt = me.translateText,
                errMsg;

            errMsg = e.error;
            errMsg = Ext.String.htmlEncode(errMsg);
            errMsg = errMsg.replace(/\^/g, '');
            errMsg = errMsg.replace(/\n+/g, '<br/>');
            errMsg = errMsg + '<br/>' + tt.invalidXmlMsg;

            Ext.Msg.show(
                {
                    title: tt.invalidXml,
                    message: errMsg,
                    buttons: Ext.Msg.OKCANCEL,
                    icon: Ext.MessageBox.WARNING,
                    fn: function (btn)
                    {
                        var BTN_OK = 'ok';

                        if (btn === BTN_OK)
                        {
                            resolve(true);
                        }
                    }
                }
            );
        }
    }
);