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
			'FBEditor.view.panel.main.editor.Loader',
			'FBEditor.view.panel.main.editor.contextmenu.Menu',
            'FBEditor.view.panel.main.xml.Manager'
		],

		enableRevision: true,

		/**
		 * @property {String} Id корневого элемента fb3-body.
		 */
		fb3BodyId: '',
		
		/**
		 * @private
		 * @property {Number} Промежуток времени для автоматического сохранения (в секундах).
		 */
		saveTime: 300,
		
		/**
		 * @private
		 * @property {Object} Содержит список задач.
		 * Смотрите Ext.util.TaskManager.
		 */
		task: null,

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.editor.Loader} Загрузчик тела с хаба.
		 */
		loader: null,

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

		createContent: function ()
		{
			var me = this;

			me.callParent(arguments);
			
			// обновляем дерево навигации по тексту
			me.updateTree();
		},
		
		createContextMenu: function (el, evt)
		{
			var me = this,
				data;
			
			evt.preventDefault();
			
			// данные контекстного меню
			data = {
				x: evt.pageX,
				y: evt.pageY,
				element: el.getBlock()
			};
			
			Ext.create('FBEditor.view.panel.main.editor.contextmenu.Menu', data);
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
            // panelSection = me.getPanelSection();
            //panelSection.fireEvent('sync');
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
		
		getPanelProps: function ()
		{
			var bridge = FBEditor.getBridgeProps(),
				panel;
			
			panel = bridge.Ext.getCmp('panel-props-body');
			
			return panel;
		},
		
		/**
		 * Инициализирует менеджер.
		 */
		init: function ()
		{
			var me = this,
				routeManager = FBEditor.route.Manager;
			
			// загрузчик
			me.loader = Ext.create('FBEditor.view.panel.main.editor.Loader', me);
			
			// менеджер редактора xml
			me.managerXml = me.managerXml || Ext.create('FBEditor.view.panel.main.xml.Manager', me);
			
			// инициализируем список задач
			me.task = {
				// задача для автосохранения
				autoSave: {
					run: function ()
					{
						me.saveToUrl()
					},
					interval: me.saveTime * 1000
				}
			};
			
			if (routeManager.isSetParam('only_text') && me.getArtId())
			{
				// автосохранение
				Ext.defer(
					function ()
					{
						me.autoSave(true);
					},
					me.saveTime * 1000,
					me
				);
			}
		},
		
		/**
		 * Сбрасывает редактор тела книги.
		 */
		reset: function ()
		{
			var me = this;
			
			me.resetFocus();
			me.loader.reset();
			me._availableSyncButtons = null;
		},
		
		/**
		 * Возвращает менеджер редактора xml.
		 * @return {FBEditor.view.panel.main.xml.Manager}
		 */
		getManagerXml: function ()
		{
			return this.managerXml;
		},
		
		/**
		 * Возвращает данные всех секций верхнего уровня.
		 * @return {Object}
		 */
		getSectionsData: function ()
		{
			var me = this,
				root = me.getContent(),
				data = [];
			
			root.each(
				function (el)
				{
					var first,
						output,
						name;
					
					if (el.isSection)
					{
						first = el.first();
						
						if (first && first.isTitle)
						{
							name = first.getText(true);
						}
						
						output = el.attributes.output || 'default';
						
						data.push(
							{
								el: el,
								output: output,
								name: name
							}
						);
					}
				}
			);
			
			return data;
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

		/**
		 * Возвращает айди произведения, загружаемого с хаба.
		 * @return {String}
		 */
		getArtId: function ()
		{
			var me = this,
				loader = me.loader;

			return loader.getArt();
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
		 * Устанавливает периодическое автосохранение.
		 * @param {Boolean} save Сохранять ли периодически.
		 */
		autoSave: function (save)
		{
			var me = this,
				taskManager = Ext.TaskManager,
				task = me.task.autoSave;
			
			if (save)
			{
				taskManager.start(task);
			}
			else
			{
				taskManager.stop(task);
			}
		},

		/**
		 * Загружается ли тело отдельно по url.
		 * @return {Boolean}
		 */
		isLoadUrl: function ()
		{
			var me = this,
				loader = me.loader;

			return loader.isLoad();
		},

		/**
		 * Загружает тело из url.
		 * @param {Number} [art] Айди произведениея на хабе.
		 */
		loadFromUrl: function (art)
		{
			var me = this,
				loader = me.loader;

			me.setLoading(art).then(
				function (art)
				{
					// загружаем тело с хаба

					art = art || me.getArtId();

					return loader.load(art);
				}
			).then(
				function (xml)
				{
					var descManager = FBEditor.desc.Manager,
						revision = me.getRevision(),
						btn,
						rev;

                    if (!descManager.isLoadUrl())
                    {
                        // если описание еще не было загружено по url, то загружаем
                        descManager.loadFromUrl();
                    }

					//console.log(xml);
					rev = xml.match(/rev (\d+) -->$/);
					rev = rev[1];

					// загружаем данные в редактор
					me.loadDataToEditor(xml);

					if (me.enableRevision)
					{
						// сохраняем ревизию
						revision.setRev(rev, xml);
					}

					// активируем кнопку сохранения тела книги
					btn = Ext.getCmp('panel-toolstab-file-button-savebody');
					btn.setActive(true);
				},
				function (response)
				{
					// возникла ошибка

					Ext.log(
						{
							level: 'error',
							msg: 'Ошибка загрузки тела книги',
							dump: response
						}
					);

					Ext.Msg.show(
						{
							title: 'Ошибка',
							message: 'Невозможно загрузить тело книги',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						}
					);

					// убираем информационное сообщение о загрузке
					me.clearLoading();
				}
			);
		},

		/**
		 * Сохраняет тело на хабе.
		 * @return {Promise}
		 */
		saveToUrl: function ()
		{
			var me = this,
				loader = me.loader,
				art = me.getArtId(),
				revision = me.getRevision(),
				rev = revision.getRev(),
				promise;
			
			promise = new Promise(
				function (resolve, reject)
				{
					me.setLoading(art, me.translateText.saving).then(
						function ()
						{
							// загружаем дифф с хаба
							return loader.loadDiff(rev);
						}
					).then(
						function (response)
						{
							var responseDiff = response.diff,
								responseRev = response.rev;
							
							//console.log('response', rev, response);
							
							if (responseRev !== rev)
							{
								// применяем дифф к тексту
								if (revision.applyDiff(responseDiff))
								{
									// устанавливаем новую ревизию
									revision.setRev(responseRev);
									rev = responseRev;
								}
							}
							
							// сохраняем дифф
							return loader.saveDiff(rev);
						},
						function (response)
						{
							// возникла ошибка
							
							Ext.log(
								{
									level: 'error',
									msg: 'Ошибка загрузки дифф тела книги',
									dump: response
								}
							);
							
							Ext.Msg.show(
								{
									title: 'Ошибка',
									message: 'Невозможно загрузить дифф тела книги',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								}
							);
							
							// убираем информационное сообщение о загрузке
							me.clearLoading();
						}
					).then(
						function (response)
						{
							var responseRev = response.rev;
							
							if (responseRev)
							{
								// устанавливаем новую ревизию
								revision.setRev(responseRev);
							}
							
							// убираем информационное сообщение о загрузке
							me.clearLoading();
							
							// флаг изменений в теле книги
							me.setChanged(false);
							
							resolve();
						},
						function (response)
						{
							// возникла ошибка
							
							Ext.log(
								{
									level: 'error',
									msg: 'Ошибка сохранения дифф тела книги',
									dump: response
								}
							);
							
							Ext.Msg.show(
								{
									title: 'Ошибка',
									message: 'Невозможно сохранить дифф тела книги',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								}
							);
							
							// убираем информационное сообщение о загрузке
							me.clearLoading();
							
							reject();
						}
					);
				}
			);
			
			return promise;
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
		 * Выполняет замену.
		 * @param {String} replaceStr Строка замены.
		 * @param {Boolean} [all] Заменить ли все совпадения.
		 * @return {Number} Количество оставшихся совпадений.
		 */
		runReplace: function (replaceStr, all)
		{
			var me = this,
				count,
				search;
			
			// объект поиска
			search = me.getSearch();
			
			if (all)
			{
				// заменяем все совпадения
				if (search.replaceAll(replaceStr))
				{
					count = 0;
				}
			}
			else
			{
				// заменяем текущее совпадение
				count = search.replace(replaceStr);
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
		 * Вызывает панель замены по тексту.
		 */
		doReplace: function ()
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
			
			// показываем панель замены
			replacePanel = panel.getReplacePanel();
			replacePanel.show();
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