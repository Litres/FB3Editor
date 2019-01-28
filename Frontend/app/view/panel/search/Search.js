/**
 * Панель поиска/замены.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.search.Search',
    {
        extend: 'Ext.Container',
        requires: [
            'FBEditor.view.panel.search.SearchController',
            'FBEditor.view.panel.search.close.Close',
	        'FBEditor.view.panel.search.find.Find',
	        'FBEditor.view.panel.search.replace.Replace'
        ],

        id: 'panel-search',
        xtype: 'panel-search',
        controller: 'panel.search',
	    
	    cls: 'panel-search',

        listeners: {
            change: 'onChange',
	        findNext: 'onFindNext',
	        findPrev: 'onFindPrev',
	        enableButtons: 'onEnableButtons',
	        disableButtons: 'onDisableButtons'
        },
	
	    layout: 'hbox',
	    width: '100%',
	
	    /**
	     * @require
	     * @property {String} Id панели редактора.
	     */
	    idEditorPanel: '',

        /**
         * @private
         * @property {Ext.Panel} Панель редактора.
         */
        editorPanel: null,
	
	    /**
	     * @private
	     * @property {FBEditor.view.panel.search.find.Find} Панель поиска.
	     */
	    findPanel: null,
	
	    /**
	     * @private
	     * @property {FBEditor.view.panel.search.replace.Replace} Панель замены.
	     */
	    replacePanel: null,
	
	    /**
	     * @private
	     * @property {Array} Кнопки для синхронизации с полем поиска.
	     */
	    buttonsSync: [],

        initComponent: function ()
        {
            var me = this;

            me.items = [
	            {
	            	xtype: 'container',
		            layout: 'vbox',
		            flex: 1,
		            items: [
			            {
				            xtype: 'panel-search-find'
			            },
			            {
				            xtype: 'panel-search-replace'
			            }
		            ]
	            },
                {
                    xtype: 'panel-search-close'
                }
            ];

            me.callParent(arguments);
        },
        
        afterHide: function ()
        {
	        var me = this,
		        editorPanel,
                manager;
	
	        editorPanel = me.getEditorPanel();
	        manager = editorPanel.getManager();
	        
	        // убираем подсветку текста после предыдущего поиска
	        manager.search();

	        me.callParent(arguments);
        },
	
	    /**
	     * Возвращает кнопки для синхронизации с полем поиска.
	     * @returns {Array}
	     */
	    getButtonsSync: function ()
	    {
	    	return this.buttonsSync;
	    },
	
	    /**
	     * Добавляет кнопку для синхронизации с полем поиска.
	     * @param {Object} btn Кнопка.
	     */
	    addButtonSync: function (btn)
	    {
	    	var me = this,
		        buttons = me.buttonsSync;
	    	
	    	buttons.push(btn);
	    },
	
	    /**
	     * Устанавливает в поле поиска фокус и выделнную часть текста из редактора.
	     */
	    setFocusSearchField: function ()
	    {
		    var me = this,
			    editorPanel,
			    manager,
			    proxyEditor,
			    text,
			    findPanel,
			    searchField;
		
		    editorPanel = me.getEditorPanel();
		    manager = editorPanel.getManager();
		    proxyEditor = manager.getProxyEditor();
		    findPanel = me.getFindPanel();
		    searchField = findPanel.getSearchField();
		
		    // получаем выделенный текст из редактора
		    text = proxyEditor.getSelection();
		
		    if (text)
		    {
			    // устанавилваем выделенный текст в поле поиска
			    searchField.setValue(text);
		    }
		    else
		    {
			    // вбрасываем событие для нового поиска
			    me.fireEvent('change');
		    }
		
		    // ставим фокус в поле поиска
		    searchField.focus(true);
	    },
	
	    /**
	     * Выполнняет замену.
	     * @param {Boolean} [all] Заменить ли все совпадения.
	     */
	    replace: function (all)
	    {
		    var me = this,
			    replacePanel,
			    replaceField,
			    editorPanel,
			    manager,
			    replaceStr,
		        count;
		
		    replacePanel = me.getReplacePanel();
		    editorPanel = me.getEditorPanel();
		    manager = editorPanel.getManager();
		
		    // строка для замены
		    replaceField = replacePanel.getReplaceField();
		    replaceStr = replaceField.getValue();
		
		    // выполняем замену
		    count = manager.replace(replaceStr, all);
		    
		    if (Ext.isNumber(count))
		    {
		    	me.setCount(count);
		    }
	    },
	
	    /**
	     * Устанавливает количество найденных результатов.
	     * @param {Number} count
	     */
	    setCount: function (count)
	    {
	    	var me = this,
			    findPanel = me.getFindPanel(),
			    countField = findPanel.getCountField();
		    
		    countField.setCount(count);
	    },
	
	    /**
	     * Синхронизирует кнопки с полем поиска.
	     * @param {Number} count Количество найженных результатов
	     */
	    syncButtons: function (count)
	    {
	    	var me = this;
	    	
	    	if (count)
		    {
		    	me.fireEvent('enableButtons');
		    }
		    else
		    {
			    me.fireEvent('disableButtons');
		    }
	    },

        /**
         * Возвращает панель редактора.
         * @return {Ext.Panel}
         */
        getEditorPanel: function ()
        {
            var me = this,
	            idEditorPanel = me.idEditorPanel,
                panel;

            panel = me.editorPanel || me.up(idEditorPanel);
            me.editorPanel = panel;

            return panel;
        },
	
	    /**
	     * Возвращает панель поиска.
	     * @return {FBEditor.view.panel.search.find.Find}
	     */
	    getFindPanel: function ()
	    {
		    var me = this,
			    panel;
		
		    panel = me.findPanel || me.down('panel-search-find');
		    me.findPanel = panel;
		
		    return panel;
	    },
	
	    /**
	     * Возвращает панель замены.
	     * @return {FBEditor.view.panel.search.replace.Replace}
	     */
	    getReplacePanel: function ()
	    {
		    var me = this,
			    panel;
		
		    panel = me.replacePanel || me.down('panel-search-replace');
		    me.replacePanel = panel;
		
		    return panel;
	    },

        /**
         * Возвращает данные для поиска.
         * @return {Object}
         * @return {String} Object.searchText Текст поиска.
         */
        getDataForSearch: function ()
        {
            var me = this,
	            findPanel = me.getFindPanel(),
                searchField = findPanel.getSearchField(),
                regexField = findPanel.getRegexField(),
	            caseField = findPanel.getCaseField(),
	            wordsField = findPanel.getWordsField(),
                data;

            data = {
                searchText: searchField.getValue(),
                isReg: regexField.getValue(),
	            ignoreCase: !caseField.getValue(),
	            words: wordsField.getValue()
            };
            
            //console.log('data', data);

            return data;
        }
    }
);