export interface GameBananaImage {
  _sBaseUrl?: string;
  _sFile?: string;
  _sFile100?: string;
  _sFile220?: string;
  _sFile530?: string;
  _sUrl?: string;
  _sCaption?: string;
  _sType?: string;
}

export interface GameBananaCategory {
  _idRow?: number;
  _sName?: string;
  _sProfileUrl?: string;
  _sIconUrl?: string;
}

export interface GameBananaSubmitter {
  _idRow?: number;
  _sName?: string;
  _sProfileUrl?: string;
  _sAvatarUrl?: string;
}

export interface GameBananaFile {
  _idRow?: string;
  _sFile?: string;
  _nFilesize?: number;
  _nDownloadCount?: number;
  _sDownloadUrl?: string;
  _sVersion?: string;
  _sDescription?: string;
}

export interface GameBananaModRecord {
  _idRow?: number;
  _sName?: string;
  _sProfileUrl?: string;
  _tsDateAdded?: number | string;
  _aSubmitter?: GameBananaSubmitter;
  _aRootCategory?: GameBananaCategory;
  _aCategory?: GameBananaCategory;
  _aPreviewMedia?: {
    _aImages?: GameBananaImage[];
  };
  _nLikeCount?: number;
  _nViewCount?: number;
  _nDownloadCount?: number;
  _sDescription?: string;
  _aFiles?: GameBananaFile[];
}

export interface GameBananaGameRecord {
  _idRow?: number | string;
  _sName?: string;
  _sProfileUrl?: string;
  _sIconUrl?: string;
  _sBannerUrl?: string;
  _sImageUrl?: string;
  _nSubmitCount?: number | string;
  _nSubmissionCount?: number | string;
  _nModCount?: number | string;
  _aPreviewMedia?: {
    _aImages?: GameBananaImage[];
  };
}

export interface GameBananaGameRootCategory {
  _idRow?: number | string;
  _sName?: string;
  _nItemCount?: number | string;
  _nCategoryCount?: number | string;
  _sUrl?: string;
  _sIconUrl?: string;
}

export interface GameBananaGameProfileRecord extends GameBananaGameRecord {
  _nSubscriberCount?: number | string;
  _aModRootCategories?: GameBananaGameRootCategory[];
}
