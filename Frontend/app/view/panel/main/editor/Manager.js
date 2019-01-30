/**
 * Менеджер редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.Manager',
	{
		extend: 'FBEditor.editor.Manager',
		requires: [
            'FBEditor.view.panel.main.xml.Manager'
		],

		/**
		 * @property {String} Id корневого элемента fb3-body.
		 */
		fb3BodyId: '',
		
        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.Manager} Менеджер редактора xml.
         */
        managerXml: null,

		/**
		 * @private
		 * @property {Boolean} Доступна ли синхронизация кнопок.
		 */
		_availableSyncButtons: null,
		
		/**
		 * @private
		 * @property {FBEditor.editor.Range} Хранит данные выделения, которые были акутальны перед поиском.
		 */
		beforeSearchRange: null,

		translateText: {
			loading: 'Загрузка текста...',
			saving: 'Сохранение текста...'
		},

		/**
		 * Инициализирует менеджер.
		 */
		init: function ()
		{
			var me = this;

            // менеджер редактора xml
            me.managerXml = me.managerXml || Ext.create('FBEditor.view.panel.main.xml.Manager', me);
		},

		/**
		 * Сбрасывает редактор тела книги.
		 */
		reset: function ()
		{
			var me = this;

			me.resetFocus();
			me._availableSyncButtons = null;
		},

		createContent: function ()
		{
			var me = this;

			me.callParent(arguments);
			
			// обновляем дерево навигации по тексту
			me.updateTree();
		},

        /**
         * Возвращает менеджер редактора xml.
         * @return {FBEditor.view.panel.main.xml.Manager}
         */
        getManagerXml: function ()
        {
            return this.managerXml;
        },

		availableSyncButtons: function ()
		{
			var me = this,
				format = FBEditor.util.Format,
				xml = me.xml,
				bytes;

			if (me._availableSyncButtons === null)
			{
				me._availableSyncButtons = true;
				bytes = format.byteLength(xml);
				//console.log('size', bytes);

				if (bytes > 1024 * 1024)
				{
					me._availableSyncButtons = false;
				}
			}

			return me._availableSyncButtons;
		},

        /**
         * Синхронизирует кнопки элементов с текущим выделением.
         */
        syncButtons: function ()
        {
            var me = this,
                panelSection;

            me.callParent(arguments);

            // синхронизируем кнопки сдвига секции
            panelSection = me.getPanelSection();
            panelSection.fireEvent('sync');
        },

		setFocusElement: function (elOrNode, sel)
		{
			var me = this,
				panelNav = me.getPanelNavigation(),
				el;

			me.callParent(arguments);

			el = me.getFocusElement();

			// разворачиваем узел элемента в дереве навигации по тексту
			panelNav.expandElement(el);
		},

        /**
         * Возвращает панель кнопок для сдвига секции.
         * @return {FBEditor.view.panel.main.navigation.section.Panel}
         */
        getPanelSection: function ()
        {
            var bridge = FBEditor.getBridgeNavigation(),
                panel;

            panel = bridge.Ext.getCmp('panel-navigation-section');

            return panel;
        },

		getPanelProps: function ()
		{
			var bridge = FBEditor.getBridgeProps(),
				panel;

			panel = bridge.Ext.getCmp('panel-props-body');

			return panel;
		},

		/**
		 * Обновляет дерево навигации по тексту.
		 */
		updateTree: function ()
		{
			var me = this,
				data = me.content,
				panel = me.getPanelNavigation(),
				managerXml = me.getManagerXml();

			if (panel)
			{
				// обновляем дерево навигации по тексту
                panel.loadData(data);

                // обновляем дерево навигации по xml
                managerXml.updateTree();
			}
			else
			{
				Ext.defer(
					function ()
					{
						me.updateTree();
					},
					200
				);
			}
		},

		/**
		 * Обновляет изображения в тексте, связывая их с соответствующим ресурсом.
		 * @param {FBEditor.resource.Resource} res Ресурс.
		 * @param {FBEditor.editor.element.AbstractElement} [parent] Родительский элемент, по умолчанию - корневой.
		 */
		linkImagesToRes: function (res, parent)
		{
			var me = this;

			parent = parent || me.getContent();

			parent.each(
				function (el)
				{
					var data = {},
						markerImg,
						attrs;

					// изображение маркера
					markerImg = el.marker && el.marker.img ? el.marker.img : null;

					if (el.isImg && el.isLoadingRes(res.fileId))
					{
						// если изображение соответствует ожидаемому ресурсу
						
						//console.log('linkImagesToRes', el, res);

						data = el.attributes;
						data.src = res.fileId;

						// обновляем изображение
						el.update(data);
					}
					else if (markerImg && markerImg.isLoadingRes(res.fileId))
					{
						// если у элемента есть маркер

						//console.log('linkImagesToRes marker', el, res);

						// аттрибуты маркера
						attrs = markerImg.attributes;

						// добавляем индекс маркера перед аттрибутами
						Ext.Object.each(
							attrs,
						    function (key, val)
						    {
							    data['marker-' + key] = val;
						    }
						);

						data['marker-src'] = res.fileId;
						data.marker = 'true';

						// обновляем изображение маркера
						el.update(data);
					}
					else if (el.children.length)
					{
						// рекурсия для потомка
						me.linkImagesToRes(res, el);
					}
				}
			);
		},
		
		/**
		 * Выполняет поиск по тексту.
		 * @param {Object} [data] Данные поиска. Если данные не переданы, то убираем подсветку текущего поиска.
		 * @param {String} data.searchText Строка поиска.
		 * @param {Boolean} [data.isReg] Регулярное ли выражение в строке поиска.
		 * @param {Boolean} [data.ignoreCase] Игнорировать ли регистр символов.
		 * @param {Boolean} [data.words] Поиск целых слов.
		 * @return {Number} Количество найденных совпадений.
		 */
		runSearch: function (data)
		{
			var me = this,
				count = 0,
				query,
				ignoreCase,
				isReg,
				words,
				search;
			
			// объект поиска
			search = me.getSearch();
			
			if (data)
			{
				query = data.searchText;
				isReg = data.isReg;
				ignoreCase = data.ignoreCase;
				words = data.words;
				
				// выполняем поиск
				count = search.find(query, data);
			}
			else
			{
				// убираем подсветку
				search.removeOverlay();
			}
			
			return count;
		},
		
		/**
		 * Переводит курсор к следующему результату поиска.
		 */
		findNext: function ()
		{
			var me = this,
				search;
			
			// объект поиска
			search = me.getSearch();
			
			search.next();
		},
		
		/**
		 * Переводит курсор к предыдущему результату поиска.
		 */
		findPrev: function ()
		{
			var me = this,
				search;
			
			// объект поиска
			search = me.getSearch();
			
			search.prev();
		},
		
		/**
		 * Вызывает панель поиска по тексту.
		 */
		doSearch: function ()
		{
			var me = this,
				panel,
				replacePanel;
			
			// сохраняем выделение
			me.beforeSearchRange = me.getRange();
			
			panel = me.getSearchPanel();
			
			if (panel.isHidden())
			{
				panel.show();
			}
			
			// ставим фокус в поле поиска
			panel.setFocusSearchField();
			
			replacePanel = panel.getReplacePanel();
			replacePanel.hide();
		},
		
		/**
		 * Закрывает панель поиска.
		 */
		doEsc: function ()
		{
			var me = this,
				panel;
			
			panel = me.getSearchPanel();
			
			if (!panel.isHidden())
			{
				// скрываем панель поиска
				panel.hide();
				
				// восстанавливаем выделение
				me.setRange(me.beforeSearchRange);
				me.restoreSelection();
			}
		},
		
		/**
		 * Возвращает панель поиска по xml.
		 * @return {FBEditor.view.panel.main.xml.search.Search}
		 */
		getSearchPanel: function ()
		{
			var me = this,
				editor = me.getEditor(),
				searchPanel;
			
			searchPanel = editor.getSearchPanel();
			
			return searchPanel;
		},

		/**
		 * @private
		 * Загружает данные в редактор тела.
		 * @param {String} xml Данные тела в виде строки xml.
		 */
		loadDataToEditor: function (xml)
		{
			var me = this,
				content = Ext.getCmp('panel-main-content');

			me.createContent(xml);
			content.fireEvent('contentBody');
		},

		/**
		 * @private
		 * Возвращает дерево навигации.
		 * @return {FBEditor.view.panel.treenavigation.body.Tree}
		 */
		getPanelNavigation: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeNavigation(),
				panel;

			panel = bridge.Ext && bridge.Ext.getCmp && bridge.Ext.getCmp('panel-body-navigation') ?
			        bridge.Ext.getCmp('panel-body-navigation') : null;

			return panel;
		},

		/**
		 * @private
		 * Устанавливает сообщение о загрузке.
		 * @param {Number} [art] Айди произведениея на хабе.
		 * @param {String} [msg] Сообщение.
		 * @return {Promise}
		 */
		setLoading: function (art, msg)
		{
			var me = this,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
					var emptyPanel = Ext.getCmp('panel-empty'),
						contentPanel = Ext.getCmp('panel-main-content');

					//console.log('emptyPanel', !emptyPanel || !emptyPanel.rendered);

					// ожидаем пока не будет отрисована пустая панель
					if (!emptyPanel || !emptyPanel.rendered)
					{
						Ext.defer(
							function ()
							{
								resolve(me.setLoading(art));
							},
							500
						);
					}

					// показываем пустую панель
					contentPanel.fireEvent('contentEmpty');

					// устанавливаем сообщение
					msg = msg || me.translateText.loading;
					emptyPanel.setMessage(msg);

					resolve(art);
				}
			);

			return promise;
		},

		/**
		 * @private
		 * Убирает информационное сообщение о загрузке.
		 */
		clearLoading: function ()
		{
			var contentPanel = Ext.getCmp('panel-main-content');

			// показываем панель описания
			contentPanel.fireEvent('contentBody');
		}
	}
);