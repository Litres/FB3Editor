/**
 * Менеджер горячих клавиш.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.hotkeys.Manager',
    {
        singleton: true,
        requires: [
            'FBEditor.hotkeys.Store',
            'FBEditor.hotkeys.converter.Converter'
        ],

        mixins: [
            'Ext.mixin.Observable'
        ],
        
        /**
         * @private
         * @property {FBEditor.hotkeys.Store} Хранилище горячих клавиш.
         */
        store: null,
	
	    /**
         * @private
         * @property {FBEditor.hotkeys.converter.Converter} Конвертер для преобразования названия клавиши к латинице.
	     */
	    converter: null,

        /**
         * @private
         * @property {Array} Данные горячих клавиш по умолчанию.
         */
        defaultData: [
            {
                // Сноски
                slot: 1
            },
            {
                // Текст сноски
                slot: 2
            },
            {
                // Заголовок для всей книги
                slot: 3
            },
            {
                // Вложенная секция
                slot: 4,
                key: 'S',
                ctrl: true,
                shift: true
            },
            {
                // Заголовок
                slot: 5,
                key: 'H',
                ctrl: true
            },
            {
                // Эпиграф
                slot: 6,
                key: 'E',
                ctrl: true
            },
            {
                // Аннотация
                slot: 7
            },
            {
                // Подпись
                slot: 8
            },
            {
                // Блок
                slot: 9,
                key: 'D',
                ctrl: true
            },
            {
                // Подзаголовок
                slot: 10,
                key: 'H',
                ctrl: true,
                alt: true
            },
            {
                // Цитата
                slot: 11,
                key: 'Q',
                ctrl: true
            },
            {
                // Предварительно отформатированный текст
                slot: 12,
                key: 'M',
                ctrl: true
            },
            {
                // Поэма
                slot: 13,
                key: 'T',
                ctrl: true,
                alt: true
            },
            {
                // Маркированный список
                slot: 14,
                key: '8',
                ctrl: true,
                shift: true
            },
            {
                // Нумерованный список
                slot: 15,
                key: '7',
                ctrl: true,
                shift: true
            },
            {
                // Изображение
                slot: 16,
                key: 'P',
                ctrl: true
            },
            {
                // Ссылка
                slot: 17,
                key: 'L',
                ctrl: true
            },
            {
                // Сноска
                slot: 18,
                key: 'N',
                ctrl: true,
                alt: true
            },
            {
                // Полужирный
                slot: 19,
                key: 'B',
                ctrl: true
            },
            {
                // Курсив
                slot: 20,
                key: 'I',
                ctrl: true
            },
            {
                // Подчёркнутый
                slot: 21,
                key: 'U',
                ctrl: true
            },
            {
                // Зачёркнутый
                slot: 22,
                key: '5',
                alt: true,
                shift: true
            },
            {
                // Межбуквенный интервал
                slot: 23,
                key: 'I',
                ctrl: true,
                shift: true
            },
            {
                // Подстрочный текст
                slot: 24,
                key: ',',
                ctrl: true
            },
            {
                // Надстрочный текст
                slot: 25,
                key: '.',
                ctrl: true
            },
            {
                // Код
                slot: 26,
                key: 'C',
                ctrl: true,
                alt: true
            },
            {
                // Span
                slot: 27,
                key: 'S',
                ctrl: true,
                alt: true
            },
            {
                // Убрать форматирование
                slot: 28,
                key: 'D',
                ctrl: true,
                alt: true
            },
            {
                // Капитель
                slot: 29
            },
            {
                // Разделить секцию
                slot: 30
            },
            {
                // Разделить элемент блочного типа
                slot: 31,
                key: 'ENTER',
                shift: true
            },
	        {
		        // Поиск
		        slot: 32,
		        key: 'F',
		        ctrl: true
	        },
	        {
		        // Замена
		        slot: 33,
		        key: 'R',
		        ctrl: true
	        }
        ],

        constructor: function (config)
        {
            var me = this;
            
            me.mixins.observable.constructor.call(me, config);
        },

        init: function ()
        {
            var me = this,
                store;

            // хранилище горячих клавиш
            store = Ext.create('FBEditor.hotkeys.Store');
            me.store = store;
	
            // конвертер названия клавиши к латинице
	        me.converter = Ext.create('FBEditor.hotkeys.converter.Converter');
	        
            Ext.each(
                me.defaultData,
                function (item)
                {
                    var slot;

                    slot = me.getSlot(item.slot);

                    if (!slot)
                    {
                        // устанавливаем данные по умолчанию
                        store.add(item);
                    }
                }
            );
        },

        /**
         * Возвращает хранилище горячих клавиш.
         * @return {FBEditor.hotkeys.Store}
         */
        getStore: function ()
        {
            return this.store;
        },
	
	    /**
	     * Возвращает конвертер для преобразования названия клавиши к латинице.
	     * @return {FBEditor.hotkeys.converter.Converter}
	     */
	    getConverter: function ()
	    {
		    return this.converter;
	    },

        /**
         * Возвращает данные слота по его номеру.
         * @param {Number} numberSlot Номер слота.
         * @return {Ext.data.Model} Данные слота.
         */
        getSlot: function (numberSlot)
        {
            var me = this,
                store = me.getStore(),
                slot;

            slot = store.findRecord('slot', numberSlot);

            return slot;
        },

        /**
         * Формирует название сочетания клавиш из переданных данных.
         * @param {Object} data Данные сочетания клавиш.
         * @param {String} [data.key]
         * @param {Boolean} [data.ctrl]
         * @param {Boolean} [data.alt]
         * @param {Boolean} [data.shift]
         * @param {String} [splitter] Символ разделяющий комбинацию клавиш. По умолчанию +.
         * @return {String} Название.
         */
        getFormatKeysText: function (data, splitter)
        {
            var text,
                split;
	
	        split = splitter || '+';
	        text = data.shift ? 'SHIFT' + split : '';
            text += data.ctrl ? 'CTRL' + split : '';
            text += data.alt ? 'ALT' + split : '';
            text += data.key ? data.key : '';

            return text;
        },

        /**
         * Возвращает номер слота для горячих клавиш.
         * @param {Object} data Данные сочетания клавиш.
         * @param {String} data.key Название обычной клавиши.
         * @param {Boolean} [data.ctrl] Зажата ли клавиша Ctrl.
         * @param {Boolean} [data.shift] Зажата ли клавиша Shift.
         * @param {Boolean} [data.alt] Зажата ли клавиша Alt.
         * @return {Number} Номер слота.
         */
        getNumberSlot: function (data)
        {
            var me = this,
                store = me.getStore(),
                numberSlot = null,
                index;
            
            // преобразуем название клавиши
            data.key = me.convertKey(data.key);
            
            index = store.findBy(
                function (record, id)
                {
                    var recordData = record.getData();

                    numberSlot = recordData.slot;

                    recordData = {
                        ctrl: recordData.ctrl,
                        alt: recordData.alt,
                        shift: recordData.shift,
                        key: recordData.key.toUpperCase()
                    };

                    if (Ext.Object.equals(data, recordData))
                    {
                        return true;
                    }
                }
            );

            numberSlot = index !== -1 ? numberSlot : null;

            return numberSlot;
        },

        /**
         * Сбрасывает данные слота по умолчанию.
         * @param {Number} numberSlot Номер слота.
         */
        resetSlot: function (numberSlot)
        {
            var me = this,
                defaultData = me.defaultData;

            Ext.each(
                defaultData,
                function (item)
                {
                    if (item.slot === numberSlot)
                    {
                        me.updateSlotData(item);

                        return true;
                    }
                }
            );
        },

        /**
         * Обновляет данные слота.
         * @event changed
         * @param {Object} data Данные сочетания клавиш.
         * @param {Number} data.slot Номер слота.
         * @param {String} [data.key] Название обычной клавиши.
         * @param {Boolean} [data.ctrl] Зажата ли клавиша Ctrl.
         * @param {Boolean} [data.shift] Зажата ли клавиша Shift.
         * @param {Boolean} [data.alt] Зажата ли клавиша Alt.
         */
        updateSlotData: function (data)
        {
            var me = this,
                store = me.getStore(),
                record;

            record = store.getById(data.slot);

            if (record)
            {
                record.set(data);
            }
            else
            {
                store.add(data);
                record = store.getById(data.slot);
                record.set(data);
            }

            // вбрасываем событие для подписчиков
            me.fireEvent('changed', data);
        },
	
	    /**
         * @private
         * Преобразует название клавиши.
	     * @param {String} key Название клавиши.
         * @return {String} Преобразованное название клаиши.
	     */
	    convertKey: function (key)
        {
            var me = this,
                converter = me.getConverter();
            
            key = converter.getChar(key);
            
            return key;
        }
    }
);