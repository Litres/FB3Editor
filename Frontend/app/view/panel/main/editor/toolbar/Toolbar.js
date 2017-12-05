/**
 * Тулбар для редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.toolbar.Toolbar',
	{
		extend: 'FBEditor.editor.view.toolbar.Toolbar',
		requires: [
			'FBEditor.view.panel.main.editor.button.a.A',
			'FBEditor.view.panel.main.editor.button.annotation.Annotation',
			'FBEditor.view.panel.main.editor.button.blockquote.Blockquote',
			'FBEditor.view.panel.main.editor.button.code.Code',
			'FBEditor.view.panel.main.editor.button.div.Div',
			'FBEditor.view.panel.main.editor.button.em.Em',
			'FBEditor.view.panel.main.editor.button.epigraph.Epigraph',
			'FBEditor.view.panel.main.editor.button.img.Img',
			'FBEditor.view.panel.main.editor.button.note.Note',
			'FBEditor.view.panel.main.editor.button.notebody.Notebody',
			'FBEditor.view.panel.main.editor.button.notes.Notes',
			'FBEditor.view.panel.main.editor.button.ol.Ol',
			'FBEditor.view.panel.main.editor.button.poem.Poem',
			'FBEditor.view.panel.main.editor.button.pre.Pre',
			'FBEditor.view.panel.main.editor.button.section.Section',
			'FBEditor.view.panel.main.editor.button.spacing.Spacing',
			'FBEditor.view.panel.main.editor.button.span.Span',
			'FBEditor.view.panel.main.editor.button.strikethrough.Strikethrough',
			'FBEditor.view.panel.main.editor.button.strong.Strong',
			'FBEditor.view.panel.main.editor.button.sub.Sub',
			'FBEditor.view.panel.main.editor.button.subscription.Subscription',
			'FBEditor.view.panel.main.editor.button.subtitle.Subtitle',
			'FBEditor.view.panel.main.editor.button.sup.Sup',
			'FBEditor.view.panel.main.editor.button.table.Table',
			'FBEditor.view.panel.main.editor.button.title.Title',
			'FBEditor.view.panel.main.editor.button.titlebody.TitleBody',
			'FBEditor.view.panel.main.editor.button.ul.Ul',
			'FBEditor.view.panel.main.editor.button.underline.Underline',
            'FBEditor.view.panel.main.editor.button.unstyle.Unstyle',
			'FBEditor.view.panel.main.editor.toolbar.responsive.button.Button',
			'FBEditor.view.panel.main.editor.toolbar.ToolbarController'
		],

		xtype: 'main-editor-toolbar',
		controller: 'main.editor.toolbar',

		listeners: {
			resize: 'onResize',
			syncHiddenButtons: 'onSyncHiddenButtons'
		},

		/**
		 * @property {Object} Адаптивные размеры, в зависимости от которых, отображается нужное количество кнопок на
		 * панели.
		 * Каждый размер предсталвяет собой минимальную ширину панели, при которой на ней помещается определенная
		 * группа кнопок.
		 */
		responsiveSizes: {
			group1: 440, // помещается только первая группа кнопок (деление на группы условно)
			group2: 740, // помещается первая и вторая группа кнопок
			group3: 970, // и т.д.
			fit: 1310 // все кнопки помещаются
		},

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.editor.toolbar.responsive.button.Button} Адаптивная кнопка.
		 */
		responsiveBtn: null,

		/**
		 * @private
		 * @property {Number} Текущий адаптивный размер из #responsiveSizes
		 * Используется для определения необходимости обновления кнопок на панели.
		 */
		currentResponsiveSize: null,

		/**
		 * @private
		 * @property {Object[]} Список видимых кнопок.
		 */
		visibleButtons: null,
		
		createSyncButtons: function ()
		{
			var me = this;

			me.syncButtons = [
				'main-editor-button-notes',
				'main-editor-button-notebody',
				'main-editor-button-titlebody',
				'main-editor-button-section',
				'main-editor-button-title',
				'main-editor-button-epigraph',
				'main-editor-button-annotation',
				'main-editor-button-subscription',
				{
					sequence: [
						'main-editor-button-div',
						'main-editor-button-subtitle',
						'main-editor-button-blockquote',
						'main-editor-button-pre',
						'main-editor-button-poem'
					]
				},
				'main-editor-button-ul',
				'main-editor-button-ol',
				'main-editor-button-table',
				'main-editor-button-img',
				'main-editor-button-a',
				'main-editor-button-note',
				'main-editor-button-strong',
				'main-editor-button-em',
				'main-editor-button-underline',
				'main-editor-button-strikethrough',
				'main-editor-button-spacing',
				'main-editor-button-sub',
				'main-editor-button-sup',
				'main-editor-button-code',
                'main-editor-button-span',
                'main-editor-button-unstyle'
			];
		},

		getButton: function (name)
		{
			var me = this,
				btn,
				xtype;

			xtype = 'main-editor-button-' + name;
			btn = Ext.ComponentQuery.query(xtype)[0];

			return btn;
		},

		/**
		 * Выполняте нажатие по кнопке форматирования.
		 * @param {String} name Имя кнопки.
		 */
		callClickButton: function (name)
		{
			var me = this,
				btn = me.getButton(name);

			function doClick(button)
			{
				if (!button.disabled)
				{
					if (button.enableToggle)
					{
						button.toggle();
					}

					button.fireEvent('click');
				}
			}

			function afterVerifyResult(button)
			{
				// удаляем событие, чтобы не было повтора
				button.removeListener('afterVerifyResult', afterVerifyResult);
				
				// делаем клик по кнопке
				doClick(button);
				
				// удаляем кнопку
				button.destroy();
			}

			if (btn)
			{
				// клик по кнопке
				doClick(btn);
			}
			else
			{
				// создаем временную кнопку
				btn = me.createTempButton(name);

				// событие вызовется после синхронизации кнопки
				btn.on('afterVerifyResult',	afterVerifyResult);

				// синхронизируем
				btn.fireEvent('sync');
			}
		},

		/**
		 * Создает временную кнопку, которая помто будет удалена.
		 * @return {FBEditor.editor.view.toolbar.button.AbstractButton} Кнопка.
		 */
		createTempButton: function (name)
		{
			var me = this,
				btn,
				xtype;

			xtype = 'main-editor-button-' + name;
			btn = Ext.widget(xtype);
			btn.setToolbar(me);

			return btn;
		},

		/**
		 * Обновляет кнопки на панели.
		 * При необходимости формирует их положение адаптивно, скрывая непомещающиеся кнопки в адаптивной кнопке.
		 */
		updateButtons: function ()
		{
			var me = this,
				visibleButtons;

			if (me.needUpdateButtons())
			{
				// получаем кнопки, которые будут отображены на панели
				visibleButtons = me.getVisibleButtons();

				// удаляем кнопки (в старом расположении)
				me.removeAll();

				// добавляем кнопки (в новом расположении)
				me.add(visibleButtons);
			}
		},

		/**
		 * Возвращает скрытые кнопки, которые не поместились на панели.
		 * @return {Object[]}
		 */
		getHiddenButtons: function ()
		{
			var me = this,
				buttons = me.getSyncButtons(),
				hiddenButtons = [];

			// если кнопка из общего списка не доступна, то значит она сркыта
			Ext.each(
				buttons,
				function (item)
				{
					var btn;

					if (Ext.isObject(item) && item.sequence)
					{
						Ext.each(
							item.sequence,
							function (itemSeq)
							{
								btn = Ext.ComponentQuery.query(itemSeq)[0];

								if (!btn || btn.hidden)
								{
									if (!btn)
									{
										btn = Ext.widget(itemSeq);
										btn.setToolbar(me);
									}

									hiddenButtons.push(btn);
								}
							}
						);
					}
					else
					{
						btn = Ext.ComponentQuery.query(item)[0];

						//console.log('hiddenbtn', Ext.ComponentQuery.query(item));
						
						if (!btn || btn.hidden)
						{
							if (!btn)
							{
								btn = Ext.widget(item);
								btn.setToolbar(me);
							}

							hiddenButtons.push(btn);
						}
					}
				}
			);

			hiddenButtons = hiddenButtons.length ? hiddenButtons : null;

			return hiddenButtons;
		},

		/**
		 * Устанавливает связь с адаптивной кнопкой.
		 * @param {FBEditor.view.panel.main.editor.toolbar.responsive.button.Button} btn
		 */
		setResponsiveButton: function (btn)
		{
			var me = this;

			me.responsiveBtn = btn;
		},

		/**
		 * Возвращает адаптивную кнпоку.
		 * @return {FBEditor.view.panel.main.editor.toolbar.responsive.button.Button}
		 */
		getResponsiveButton: function ()
		{
			var me = this,
				btn;

			btn = me.responsiveBtn || Ext.widget('main-editor-toolbar-responsive-button');
			me.responsiveBtn = btn;

			// устанавливаем связб
			btn.setToolbar(me);

			return btn;
		},

		/**
		 * @private
		 * Возвращает кнопки, которые помещаются на панели.
		 * @return {Object[]}
		 */
		getVisibleButtons: function ()
		{
			var me = this,
				responsiveSizes = me.responsiveSizes,
				bodyWidth = Ext.getBody().getWidth(),
				responsiveBtn,
				spacer,
				buttons;

			// сбрасываем текущий сохраненный адаптивный размер
			me.currentResponsiveSize = null;

			// отступ между группами кнопок на панели
			spacer = me.getSpacer();

			// кнопки, которые всегда помещаются на панели
			buttons = [
				{
					xtype: 'main-editor-button-notes'
				},
				{
					xtype: 'main-editor-button-notebody'
				},
				spacer,
				{
					xtype: 'main-editor-button-titlebody'
				},
				{
					xtype: 'main-editor-button-section'
				},
				spacer
			];

			if (bodyWidth >= responsiveSizes.group1)
			{
				// сохраняем текущий адаптивный размер
				me.currentResponsiveSize = responsiveSizes.group1;

				Ext.Array.push(
					buttons,
					[
						spacer,
						{
							xtype: 'main-editor-button-title'
						},
						{
							xtype: 'main-editor-button-epigraph'
						},
						{
							xtype: 'main-editor-button-annotation'
						},
						{
							xtype: 'main-editor-button-subscription'
						}
					]
				);
			}

			if (bodyWidth >= responsiveSizes.group2)
			{
				me.currentResponsiveSize = responsiveSizes.group2;

				Ext.Array.push(
					buttons,
				    [
					    spacer,
					    {
						    xtype: 'main-editor-button-div'
					    },
					    {
						    xtype: 'main-editor-button-subtitle'
					    },
					    {
						    xtype: 'main-editor-button-blockquote'
					    },
					    {
						    xtype: 'main-editor-button-pre'
					    },
					    {
						    xtype: 'main-editor-button-poem'
					    },
					    {
						    xtype: 'main-editor-button-ul'
					    },
					    {
						    xtype: 'main-editor-button-ol'
					    }
				    ]
				);
			}

			if (bodyWidth >= responsiveSizes.group3)
			{
				me.currentResponsiveSize = responsiveSizes.group3;

				Ext.Array.push(
					buttons,
					[
						spacer,
						{
							xtype: 'main-editor-button-table'
						},
						spacer,
						{
							xtype: 'main-editor-button-img'
						},
						{
							xtype: 'main-editor-button-a'
						},
						{
							xtype: 'main-editor-button-note'
						}
					]
				);
			}

			if (bodyWidth >= responsiveSizes.fit)
			{
				me.currentResponsiveSize = responsiveSizes.fit;

				Ext.Array.push(
					buttons,
					[
						spacer,
						{
							xtype: 'main-editor-button-strong'
						},
						{
							xtype: 'main-editor-button-em'
						},
						{
							xtype: 'main-editor-button-underline'
						},
						{
							xtype: 'main-editor-button-strikethrough'
						},
						{
							xtype: 'main-editor-button-spacing'
						},
						{
							xtype: 'main-editor-button-sub'
						},
						{
							xtype: 'main-editor-button-sup'
						},
						{
							xtype: 'main-editor-button-code'
						},
						{
							xtype: 'main-editor-button-span'
						},
                        {
                            xtype: 'main-editor-button-unstyle'
                        }
					]
				);
			}
			else
			{
				// адаптивная кнопка
				me.setResponsiveButton(null);
				responsiveBtn = me.getResponsiveButton();

				// последний разделитель делаем растягивающимся, чтобы адаптивная кнопка поместилась в конец панели
				buttons.push(
					{
						xtype: 'tbspacer',
						flex: 1
					}
				);

				// добавляем кнопку
				buttons.push(responsiveBtn);
			}

			// сохраняем список видимых кнопок, чтобы в дальнейшем определить списко невидимых
			me.visibleButtons = buttons;

			return buttons;
		},

		/**
		 * @private
		 * Возвращает отступ между кнопками на панели.
		 * @return {Object}
		 */
		getSpacer: function ()
		{
			var me = this,
				spacer;

			spacer = {
				xtype: 'tbspacer',
				width: 20
			};

			return spacer;
		},

		/**
		 * @private
		 * Определяет нужно ли обновлять кнопки на панели.
		 * @return {Boolean}
		 */
		needUpdateButtons: function ()
		{
			var me = this,
				responsiveSizes = me.responsiveSizes,
				bodyWidth = Ext.getBody().getWidth(),
				currentResponsiveSize = me.currentResponsiveSize,
				responsiveSize = null,
				need;

			responsiveSize = bodyWidth >= responsiveSizes.group1 ? responsiveSizes.group1 : responsiveSize;
			responsiveSize = bodyWidth >= responsiveSizes.group2 ? responsiveSizes.group2 : responsiveSize;
			responsiveSize = bodyWidth >= responsiveSizes.group3 ? responsiveSizes.group3 : responsiveSize;
			responsiveSize = bodyWidth >= responsiveSizes.fit ? responsiveSizes.fit : responsiveSize;

			need = responsiveSize !== currentResponsiveSize;

			return need;
		}
	}
);