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
			'FBEditor.view.panel.main.editor.Loader'
		],

		enableRevision: true,

		/**
		 * @property {String} Id корневого элемента fb3-body.
		 */
		fb3BodyId: '',

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.editor.Loader} Загрузчик тела с хаба.
		 */
		loader: null,

		/**
		 * @private
		 * @property {Boolean} Доступна ли синхронизация кнопок.
		 */
		_availableSyncButtons: null,

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

			// загрузчик
			me.loader = Ext.create('FBEditor.view.panel.main.editor.Loader', me);
		},

		/**
		 * Сбрасывает редактор тела книги.
		 */
		reset: function ()
		{
			var me = this;
			
			me.loader.reset();
			me._availableSyncButtons = null;
		},

		createContent: function ()
		{
			var me = this;

			me.callParent(arguments);
			
			// обновляем дерево навигации по тексту
			me.updateTree();
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
				panel = me.getPanelNavigation();

			if (panel)
			{
				panel.loadData(me.content);
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
					var resourceManager = FBEditor.resource.Manager,
						revision = me.getRevision(),
						btn,
						rev;

					//console.log(xml);
					rev = xml.match(/rev (\d+) -->$/);
					rev = rev[1];

					// загружены ли уже ресурсы
					if (!resourceManager.isLoadUrl())
					{
						// загружаем ресурсы с хаба
						resourceManager.loadFromUrl(me.getArtId());
					}

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
		 */
		saveToUrl: function ()
		{
			var me = this,
				loader = me.loader,
				art = me.getArtId(),
				revision = me.getRevision(),
				rev = revision.getRev();

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
				}
			);
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
					var data;

					// если изображение соответствует ожидаемому ресурсу
					if (el.isImg && el.isLoadingRes(res.fileId))
					{
						data = el.attributes;
						data.src = res.fileId;

						// обновляем изображение
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