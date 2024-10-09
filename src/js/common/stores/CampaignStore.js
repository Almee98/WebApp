import { ReduceStore } from 'flux/utils';
import { avatarGeneric } from '../../utils/applicationUtils';
import Dispatcher from '../dispatcher/Dispatcher';
import arrayContains from '../utils/arrayContains';
import generateCampaignXDictFromCandidateDict from '../utils/generateCampaignXDictFromCandidateDict';
import VoterStore from '../../stores/VoterStore'; // eslint-disable-line import/no-cycle

const SUPPORTERS_COUNT_NEXT_GOAL_DEFAULT = 10;

class CampaignStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedCampaignXDicts: {}, // key == campaignXWeVoteId, value = campaignX data dict
      allCachedCampaignXNewsItems: {}, // Dictionary with campaignx_news_item_we_vote_id key and the CampaignXNews as value
      allCachedNewsItemWeVoteIdsByCampaignX: {}, // Dictionary with campaignx_we_vote_id as key and the CampaignXNews for this voter as value
      allCachedCampaignXOwners: {}, // key == campaignXWeVoteId, value = list of owners of this campaign
      allCachedCampaignXOwnerPhotos: {}, // key == campaignXWeVoteId, value = Tiny Profile Photo to show
      allCachedCampaignXPoliticianLists: {}, // key == campaignXWeVoteId, value = list of politicians supported in this Campaign
      allCachedCampaignXWeVoteIdsBySEOFriendlyPath: {}, // key == campaignSEOFriendlyPath, value = campaignXWeVoteId
      allCachedPoliticians: {}, // key == politicianWeVoteId, value = the Politician
      allCachedPoliticianWeVoteIdsByCampaignX: {}, // key == campaignXWeVoteId, value == list of politicianWeVoteIds in the campaign
      allCachedRecommendedCampaignXWeVoteIdLists: {}, // key == campaignXWeVoteId, value = list of campaigns recommended
      promotedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter started
      voterCanSendUpdatesCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter can send updates to
      voterCanVoteForPoliticianWeVoteIds: [], // These are the politician_we_vote_id's this voter can vote for
      voterOwnedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter can edit
      voterStartedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter started
      voterSupportedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter supports
      voterWeVoteId: '',
    };
  }

  resetVoterSpecificData () {
    return {
      allCachedCampaignXWeVoteIdsBySEOFriendlyPath: {}, // key == campaignSEOFriendlyPath, value = campaignXWeVoteId
      promotedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter started
      voterCanSendUpdatesCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter can send updates to
      voterCanVoteForPoliticianWeVoteIds: [], // These are the politician_we_vote_id's this voter can vote for
      voterOwnedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter can edit
      voterStartedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter started
      voterSupportedCampaignXWeVoteIds: [], // These are the campaignx_we_vote_id's of the campaigns this voter supports
      voterWeVoteId: '',
    };
  }

  campaignNewsItemTextExists (campaignXNewsItemWeVoteId) {
    if (campaignXNewsItemWeVoteId) {
      const campaignXNewsItem = this.getCampaignXNewsItemByWeVoteId(campaignXNewsItemWeVoteId);
      // console.log('campaignNewsItemTextExists, campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
      if ('campaign_news_text' in campaignXNewsItem && campaignXNewsItem.campaign_news_text) {
        return Boolean(campaignXNewsItem.campaign_news_text.length > 0);
      }
    }
    return false;
  }

  campaignXIsLoaded (campaignXWeVoteId) {
    if (campaignXWeVoteId) {
      const campaignX = this.getCampaignXByWeVoteId(campaignXWeVoteId);
      // console.log('campaignXIsLoaded, campaignX:', campaignX);
      if ('campaignx_we_vote_id' in campaignX) {
        return Boolean(campaignX.campaignx_we_vote_id);
      }
    }
    return false;
  }

  extractCampaignXOwnerList (campaignX, allCachedCampaignXOwnersIncoming, allCachedCampaignXOwnerPhotosIncoming, voterCanSendUpdatesCampaignXWeVoteIdsIncoming, voterOwnedCampaignXWeVoteIdsIncoming) {
    const allCachedCampaignXOwners = allCachedCampaignXOwnersIncoming;
    const allCachedCampaignXOwnerPhotos = allCachedCampaignXOwnerPhotosIncoming;
    const campaignXOwnersFiltered = [];
    let featuredProfileImageFound = false;
    let firstProfileImageFound = false;
    let useThisProfileImage = false;
    const voterCanSendUpdatesCampaignXWeVoteIds = voterCanSendUpdatesCampaignXWeVoteIdsIncoming;
    const voterOwnedCampaignXWeVoteIds = voterOwnedCampaignXWeVoteIdsIncoming;
    const linkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    // console.log('extractCampaignXOwnerList campaignX:', campaignX);
    if (campaignX.voter_can_send_updates_to_campaignx) {
      if (!(arrayContains(campaignX.campaignx_we_vote_id, voterCanSendUpdatesCampaignXWeVoteIds))) {
        voterCanSendUpdatesCampaignXWeVoteIds.push(campaignX.campaignx_we_vote_id);
      }
    }
    if (campaignX.voter_is_campaignx_owner) {
      if (!(arrayContains(campaignX.campaignx_we_vote_id, voterOwnedCampaignXWeVoteIds))) {
        voterOwnedCampaignXWeVoteIds.push(campaignX.campaignx_we_vote_id);
      }
    }
    for (let i = 0; i < campaignX.campaignx_owner_list.length; ++i) {
      // console.log('CampaignStore owner_list i: ', i, ', one_owner: ', campaignX.campaignx_owner_list[i]);
      if (campaignX.campaignx_owner_list[i].organization_we_vote_id &&
          campaignX.campaignx_owner_list[i].organization_we_vote_id === linkedOrganizationWeVoteId) {
        if (!(arrayContains(campaignX.campaignx_we_vote_id, voterOwnedCampaignXWeVoteIds))) {
          voterOwnedCampaignXWeVoteIds.push(campaignX.campaignx_we_vote_id);
        }
      }
      if (campaignX.campaignx_owner_list[i].visible_to_public) {
        if (campaignX.campaignx_owner_list[i].organization_name) {
          campaignXOwnersFiltered.push(campaignX.campaignx_owner_list[i]);
        }
        if (campaignX.campaignx_owner_list[i].we_vote_hosted_profile_image_url_tiny) {
          if (campaignX.campaignx_owner_list[i].feature_this_profile_image) {
            if (!featuredProfileImageFound) {
              // Always use the first profile image found which is featured
              useThisProfileImage = true;
            }
            featuredProfileImageFound = true;
            firstProfileImageFound = true;
          }
          if (!featuredProfileImageFound && !firstProfileImageFound) {
            // Use this image if it is the first image found and a featured image hasn't already been found
            useThisProfileImage = true;
          }
          if (useThisProfileImage) {
            allCachedCampaignXOwnerPhotos[campaignX.campaignx_we_vote_id] = campaignX.campaignx_owner_list[i].we_vote_hosted_profile_image_url_tiny;
          }
        }
      }
    }
    allCachedCampaignXOwners[campaignX.campaignx_we_vote_id] = campaignXOwnersFiltered;

    return {
      allCachedCampaignXOwners,
      allCachedCampaignXOwnerPhotos,
      voterCanSendUpdatesCampaignXWeVoteIds,
      voterOwnedCampaignXWeVoteIds,
    };
  }

  extractCampaignXPoliticianList (campaignX, allCachedCampaignXPoliticianListsIncoming) {
    const allCachedCampaignXPoliticianLists = allCachedCampaignXPoliticianListsIncoming;
    const campaignXPoliticianListFiltered = [];
    for (let i = 0; i < campaignX.campaignx_politician_list.length; ++i) {
      // console.log('CampaignStore owner_list i: ', i, ', one_owner: ', campaignX.campaignx_politician_list[i]);
      if (campaignX.campaignx_politician_list[i].politician_name) {
        campaignXPoliticianListFiltered.push(campaignX.campaignx_politician_list[i]);
      }
    }
    allCachedCampaignXPoliticianLists[campaignX.campaignx_we_vote_id] = campaignXPoliticianListFiltered;

    return {
      allCachedCampaignXPoliticianLists,
    };
  }

  extractPoliticianWeVoteIdListFromCampaign (campaignX, allCachedPoliticianWeVoteIdsByCampaignXIncoming) {
    const allCachedPoliticianWeVoteIdsByCampaignX = allCachedPoliticianWeVoteIdsByCampaignXIncoming;
    const politicianWeVoteIdListFiltered = [];
    for (let i = 0; i < campaignX.campaignx_politician_list.length; ++i) {
      // console.log('CampaignStore politician i: ', i, ': ', campaignX.campaignx_politician_list[i]);
      if (campaignX.campaignx_politician_list[i].politician_name) {
        politicianWeVoteIdListFiltered.push(campaignX.campaignx_politician_list[i].politician_we_vote_id);
      }
    }
    allCachedPoliticianWeVoteIdsByCampaignX[campaignX.campaignx_we_vote_id] = politicianWeVoteIdListFiltered;

    return {
      allCachedPoliticianWeVoteIdsByCampaignX,
    };
  }

  getAllCachedCampaignXList () {
    const { allCachedCampaignXDicts } = this.getState();
    return Object.values(allCachedCampaignXDicts);
  }

  getCampaignXBySEOFriendlyPath (campaignSEOFriendlyPath) {
    const campaignXWeVoteId = this.getState().allCachedCampaignXWeVoteIdsBySEOFriendlyPath[campaignSEOFriendlyPath] || '';
    const campaignX = this.getState().allCachedCampaignXDicts[campaignXWeVoteId];
    // console.log('CampaignStore getCampaignXBySEOFriendlyPath campaignSEOFriendlyPath:', campaignSEOFriendlyPath, ', campaignXWeVoteId:', campaignXWeVoteId, ', campaignX:', campaignX);
    if (campaignX === undefined) {
      return {};
    }
    return campaignX;
  }

  getCampaignXFinalElectionDateInPastByWeVoteId (campaignXWeVoteId) {
    const campaignX = this.getState().allCachedCampaignXDicts[campaignXWeVoteId];
    if (campaignX === undefined || campaignX.final_election_date_in_past === undefined) {
      return false;
    }
    return campaignX.final_election_date_in_past;
  }

  getCampaignXByWeVoteId (campaignXWeVoteId) {
    const campaignX = this.getState().allCachedCampaignXDicts[campaignXWeVoteId];
    if (campaignX === undefined) {
      return {};
    }
    return campaignX;
  }

  getCampaignXNewsItemByWeVoteId (campaignXNewsItemWeVoteId) {
    return this.getState().allCachedCampaignXNewsItems[campaignXNewsItemWeVoteId] || {};
  }

  getCampaignXNewsItemDateSentToEmail (campaignXNewsItemWeVoteId) {
    const newsItem = this.getState().allCachedCampaignXNewsItems[campaignXNewsItemWeVoteId] || {};
    if (newsItem && newsItem.date_sent_to_email) {
      return newsItem.date_sent_to_email;
    }
    return '';
  }

  getCampaignXNewsItemsExist (campaignXWeVoteId) {
    const newsItemListWeVoteIds = this.getState().allCachedNewsItemWeVoteIdsByCampaignX[campaignXWeVoteId] || [];
    return Boolean(newsItemListWeVoteIds.length);
  }

  getCampaignXNewsItemList (campaignXWeVoteId) {
    const newsItemListWeVoteIds = this.getState().allCachedNewsItemWeVoteIdsByCampaignX[campaignXWeVoteId] || [];
    const campaignXNewsItemList = [];
    if (newsItemListWeVoteIds) {
      let campaignXNewsItem;
      newsItemListWeVoteIds.forEach((campaignXNewsItemWeVoteId) => {
        if (this.getState().allCachedCampaignXNewsItems[campaignXNewsItemWeVoteId]) {
          campaignXNewsItem = this.getState().allCachedCampaignXNewsItems[campaignXNewsItemWeVoteId];
          campaignXNewsItemList.push(campaignXNewsItem);
        }
      });
    }
    return campaignXNewsItemList;
  }

  getCampaignXOwnerList (campaignXWeVoteId) {
    return this.getState().allCachedCampaignXOwners[campaignXWeVoteId] || [];
  }

  getCampaignXLeadOwnerProfilePhoto (campaignXWeVoteId, hideAnonymousImage = false) {
    const alternateImage = hideAnonymousImage ? '' : avatarGeneric();
    return this.getState().allCachedCampaignXOwnerPhotos[campaignXWeVoteId] || alternateImage;
  }

  getCampaignXPoliticianList (campaignXWeVoteId) {
    return this.getState().allCachedCampaignXPoliticianLists[campaignXWeVoteId] || [];
  }

  getCampaignXSupportersCountNextGoalDefault () {
    return SUPPORTERS_COUNT_NEXT_GOAL_DEFAULT;
  }

  getRecommendedCampaignXList (campaignXWeVoteId) {
    const recommendedCampaignXWeVoteIdList = this.getState().allCachedRecommendedCampaignXWeVoteIdLists[campaignXWeVoteId] || [];
    return this.getCampaignXListFromListOfWeVoteIds(recommendedCampaignXWeVoteIdList);
  }

  getRecommendedCampaignXListCount (campaignXWeVoteId) {
    const recommendedCampaignXWeVoteIdList = this.getState().allCachedRecommendedCampaignXWeVoteIdLists[campaignXWeVoteId] || [];
    return recommendedCampaignXWeVoteIdList.length;
  }

  getRecommendedCampaignXListHasBeenRetrieved (campaignXWeVoteId) {
    if (!campaignXWeVoteId) {
      return null;
    }
    return campaignXWeVoteId in this.getState().allCachedRecommendedCampaignXWeVoteIdLists;
  }

  getCampaignXWeVoteIdFromCampaignSEOFriendlyPath (campaignSEOFriendlyPath) {
    return this.getState().allCachedCampaignXWeVoteIdsBySEOFriendlyPath[campaignSEOFriendlyPath] || '';
  }

  getCampaignXListFromListOfWeVoteIds (listOfCampaignXWeVoteIds) {
    let { allCachedCampaignXDicts } = this.getState();
    // console.log('getCampaignXListFromListOfWeVoteIds listOfCampaignXWeVoteIds: ', listOfCampaignXWeVoteIds);
    // make sure that listOfCampaignXWeVoteIds has unique values
    const uniqListOfCampaignXWeVoteIds = listOfCampaignXWeVoteIds.filter((value, index, self) => self.indexOf(value) === index);

    if (allCachedCampaignXDicts === undefined) {
      allCachedCampaignXDicts = {};
    }
    const campaignXList = [];
    let campaignX;
    uniqListOfCampaignXWeVoteIds.forEach((campaignXWeVoteId) => {
      if (allCachedCampaignXDicts[campaignXWeVoteId]) {
        campaignX = allCachedCampaignXDicts[campaignXWeVoteId];
        campaignXList.push(campaignX);
      }
    });
    // console.log('getCampaignXListFromListOfWeVoteIds campaignXList: ', campaignXList);

    return campaignXList;
  }

  getPromotedCampaignXDicts () {
    return this.getCampaignXListFromListOfWeVoteIds(this.getState().promotedCampaignXWeVoteIds);
  }

  getVoterCanEditThisCampaign (campaignXWeVoteId) {
    // console.log('this.getState().voterOwnedCampaignXWeVoteIds:', this.getState().voterOwnedCampaignXWeVoteIds);
    return arrayContains(campaignXWeVoteId, this.getState().voterOwnedCampaignXWeVoteIds);
  }

  getVoterCanSendUpdatesToThisCampaign (campaignXWeVoteId) {
    // console.log('this.getState().voterCanSendUpdatesCampaignXWeVoteIds:', this.getState().voterCanSendUpdatesCampaignXWeVoteIds);
    return arrayContains(campaignXWeVoteId, this.getState().voterCanSendUpdatesCampaignXWeVoteIds);
  }

  getVoterCanVoteForPoliticianInCampaign (campaignXWeVoteId) {
    const { allCachedPoliticianWeVoteIdsByCampaignX, voterCanVoteForPoliticianWeVoteIds } = this.getState();  //
    // console.log('campaignXWeVoteId:', campaignXWeVoteId);
    if (allCachedPoliticianWeVoteIdsByCampaignX && allCachedPoliticianWeVoteIdsByCampaignX[campaignXWeVoteId]) {
      const politicianWeVoteIdsForCampaign = allCachedPoliticianWeVoteIdsByCampaignX[campaignXWeVoteId];
      const intersection = politicianWeVoteIdsForCampaign.filter((x) => voterCanVoteForPoliticianWeVoteIds.includes(x));
      if (intersection && intersection.length > 0) {
        // console.log('intersection:', intersection);
        return true;
      }
    }
    return false;
  }

  getVoterOwnedCampaignXDicts () {
    return this.getCampaignXListFromListOfWeVoteIds(this.getState().voterOwnedCampaignXWeVoteIds);
  }

  getVoterOwnedCampaignXWeVoteIds () {
    return this.getState().voterOwnedCampaignXWeVoteIds;
  }

  getVoterStartedCampaignXDicts () {
    return this.getCampaignXListFromListOfWeVoteIds(this.getState().voterStartedCampaignXWeVoteIds);
  }

  getVoterSupportedCampaignXDicts () {
    return this.getCampaignXListFromListOfWeVoteIds(this.getState().voterSupportedCampaignXWeVoteIds);
  }

  getVoterSupportsThisCampaign (campaignXWeVoteId) {
    // console.log('this.getState().voterSupportedCampaignXWeVoteIds:', this.getState().voterSupportedCampaignXWeVoteIds);
    return arrayContains(campaignXWeVoteId, this.getState().voterSupportedCampaignXWeVoteIds);
  }

  createCampaignXFromCandidate (candidateObject) {
    // We want to create a pseudo CampaignX object from an incoming Candidate object
    // console.log('candidateObject: ', candidateObject);
    return {
      campaign_description: candidateObject.ballot_guide_official_statement,
      campaign_title: candidateObject.ballot_item_display_name,
      campaignx_news_item_list: [],
      campaignx_owner_list: [],
      campaignx_politician_list: [],
      campaignx_politician_list_exists: false,
      campaignx_politician_starter_list: [],
      campaignx_we_vote_id: candidateObject.linked_campaignx_we_vote_id,
      final_election_date_as_integer: candidateObject.candidate_ultimate_election_date,
      final_election_date_in_past: !(candidateObject.election_is_upcoming),
      in_draft_mode: false,
      is_blocked_by_we_vote: false,
      is_blocked_by_we_vote_reason: null,
      is_supporters_count_minimum_exceeded: true,
      latest_campaignx_supporter_endorsement_list: [],
      latest_campaignx_supporter_list: [],
      linked_politician_we_vote_id: candidateObject.politician_we_vote_id,
      opposers_count: candidateObject.opposers_count,
      order_in_list: 0,
      profile_image_background_color: candidateObject.profile_image_background_color,
      seo_friendly_path: candidateObject.seo_friendly_path,
      seo_friendly_path_list: [],
      status: 'PSEUDO_CAMPAIGNX_GENERATED_FROM_CANDIDATE ',
      success: true,
      supporters_count: candidateObject.supporters_count,
      supporters_count_next_goal: 0,
      supporters_count_victory_goal: 0,
      visible_on_this_site: true,
      voter_campaignx_supporter: {},
      voter_can_send_updates_to_campaignx: false,
      voter_can_vote_for_politician_we_vote_ids: [],
      voter_is_campaignx_owner: false,
      voter_signed_in_with_email: false,
      we_vote_hosted_campaign_photo_large_url: null,
      we_vote_hosted_campaign_photo_medium_url: null,
      we_vote_hosted_campaign_photo_small_url: null,
      we_vote_hosted_profile_image_url_large: candidateObject.candidate_photo_url_large,
      we_vote_hosted_profile_image_url_medium: candidateObject.candidate_photo_url_medium,
      we_vote_hosted_profile_image_url_tiny: candidateObject.candidate_photo_url_tiny,
    };
  }

  reduce (state, action) {
    const {
      allCachedCampaignXNewsItems,
      allCachedCampaignXWeVoteIdsBySEOFriendlyPath, allCachedNewsItemWeVoteIdsByCampaignX,
      allCachedRecommendedCampaignXWeVoteIdLists, voterSupportedCampaignXWeVoteIds,
    } = state;
    let {
      allCachedCampaignXDicts, allCachedCampaignXOwners, allCachedCampaignXPoliticianLists, allCachedCampaignXOwnerPhotos,
      allCachedPoliticianWeVoteIdsByCampaignX, promotedCampaignXWeVoteIds,
      voterCanSendUpdatesCampaignXWeVoteIds, voterCanVoteForPoliticianWeVoteIds, voterOwnedCampaignXWeVoteIds,
      voterStartedCampaignXWeVoteIds,
    } = state;
    let campaignX;
    let campaignXList;
    let campaignXNewsItem;
    let campaignXNewsItemWeVoteIds;
    let candidateList;
    let opponentCandidateList = [];
    let recommendedCampaignsCampaignXWeVoteId;
    let revisedState;
    let voterSpecificData;
    switch (action.type) {
      case 'campaignListRetrieve':
        // See CampaignSupporterStore for code to take in the following campaignX values:
        // - latest_campaignx_supporter_endorsement_list
        // - latest_campaignx_supporter_list
        // - voter_campaignx_supporter

        if (!action.res || !action.res.success) return state;
        revisedState = state;
        campaignXList = action.res.campaignx_list || [];
        recommendedCampaignsCampaignXWeVoteId = '';

        if (action.res.promoted_campaignx_list_returned) {
          if (action.res.promoted_campaignx_we_vote_ids) {
            promotedCampaignXWeVoteIds = action.res.promoted_campaignx_we_vote_ids;
            revisedState = { ...revisedState, promotedCampaignXWeVoteIds };
          }
        }
        if (action.res.recommended_campaigns_for_campaignx_we_vote_id) {
          recommendedCampaignsCampaignXWeVoteId = action.res.recommended_campaigns_for_campaignx_we_vote_id;
          // console.log('recommendedCampaignsCampaignXWeVoteId:', recommendedCampaignsCampaignXWeVoteId);
        }
        if (action.res.voter_can_vote_for_politicians_list_returned) {
          if (action.res.voter_can_vote_for_politician_we_vote_ids) {
            // We want to reset this variable with this incoming value
            voterCanVoteForPoliticianWeVoteIds = action.res.voter_can_vote_for_politician_we_vote_ids;
            revisedState = { ...revisedState, voterCanVoteForPoliticianWeVoteIds };
          }
        }
        if (action.res.voter_owned_campaignx_list_returned) {
          if (action.res.voter_owned_campaignx_we_vote_ids) {
            // We want to reset this variable with this incoming value
            voterOwnedCampaignXWeVoteIds = action.res.voter_owned_campaignx_we_vote_ids;
            // revisedState updated with voterOwnedCampaignXWeVoteIds below
          }
          if (action.res.voter_can_send_updates_campaignx_we_vote_ids) {
            // We want to reset this variable with this incoming value
            voterCanSendUpdatesCampaignXWeVoteIds = action.res.voter_can_send_updates_campaignx_we_vote_ids;
            // console.log('voterCanSendUpdatesCampaignXWeVoteIds:', voterCanSendUpdatesCampaignXWeVoteIds);
            // revisedState updated below
          }
        }
        if (action.res.voter_started_campaignx_list_returned) {
          if (action.res.voter_started_campaignx_we_vote_ids) {
            voterStartedCampaignXWeVoteIds = action.res.voter_started_campaignx_we_vote_ids;
            revisedState = { ...revisedState, voterStartedCampaignXWeVoteIds };
          }
        }
        if (action.res.voter_supported_campaignx_list_returned) {
          if (action.res.voter_supported_campaignx_we_vote_ids) {
            // console.log('action.res.voter_supported_campaignx_we_vote_ids:', action.res.voter_supported_campaignx_we_vote_ids);
            action.res.voter_supported_campaignx_we_vote_ids.forEach((oneCampaignXWeVoteId) => {
              if (!(oneCampaignXWeVoteId in voterSupportedCampaignXWeVoteIds)) {
                voterSupportedCampaignXWeVoteIds.push(oneCampaignXWeVoteId);
              }
            });
            revisedState = { ...revisedState, voterSupportedCampaignXWeVoteIds };
          }
        }

        // console.log('action.res.voter_issues_only:', action.res.voter_issues_only);
        if (recommendedCampaignsCampaignXWeVoteId) {
          if (!(recommendedCampaignsCampaignXWeVoteId in allCachedRecommendedCampaignXWeVoteIdLists)) {
            allCachedRecommendedCampaignXWeVoteIdLists[recommendedCampaignsCampaignXWeVoteId] = [];
          }
        }
        if (allCachedCampaignXDicts === undefined) {
          allCachedCampaignXDicts = {};
        }
        campaignXList.forEach((oneCampaignX) => {
          allCachedCampaignXDicts[oneCampaignX.campaignx_we_vote_id] = oneCampaignX;
          if (recommendedCampaignsCampaignXWeVoteId) {
            allCachedRecommendedCampaignXWeVoteIdLists[recommendedCampaignsCampaignXWeVoteId].push(oneCampaignX.campaignx_we_vote_id);
          }
          ({
            allCachedCampaignXOwners,
            allCachedCampaignXOwnerPhotos,
            voterCanSendUpdatesCampaignXWeVoteIds,
            voterOwnedCampaignXWeVoteIds,
          } = this.extractCampaignXOwnerList(oneCampaignX, allCachedCampaignXOwners, allCachedCampaignXOwnerPhotos, voterCanSendUpdatesCampaignXWeVoteIds, voterOwnedCampaignXWeVoteIds));
          if ('campaignx_politician_list' in oneCampaignX) {
            ({ allCachedCampaignXPoliticianLists } = this.extractCampaignXPoliticianList(oneCampaignX, allCachedCampaignXPoliticianLists));
            ({ allCachedPoliticianWeVoteIdsByCampaignX } = this.extractPoliticianWeVoteIdListFromCampaign(oneCampaignX, allCachedPoliticianWeVoteIdsByCampaignX));
          }
          if (!(oneCampaignX.seo_friendly_path in allCachedCampaignXWeVoteIdsBySEOFriendlyPath)) {
            allCachedCampaignXWeVoteIdsBySEOFriendlyPath[oneCampaignX.seo_friendly_path] = oneCampaignX.campaignx_we_vote_id;
          }
          if ('seo_friendly_path_list' in oneCampaignX) {
            //
            let onePath = '';
            for (let i = 0; i < oneCampaignX.seo_friendly_path_list.length; ++i) {
              onePath = oneCampaignX.seo_friendly_path_list[i];
              if (onePath && onePath !== '') {
                if (!(onePath in allCachedCampaignXWeVoteIdsBySEOFriendlyPath)) {
                  allCachedCampaignXWeVoteIdsBySEOFriendlyPath[onePath] = oneCampaignX.campaignx_we_vote_id;
                }
              }
            }
          }
        });
        // console.log('allCachedCampaignXWeVoteIdsBySEOFriendlyPath:', allCachedCampaignXWeVoteIdsBySEOFriendlyPath);
        /* TODO: Next time we are testing this area... this should work, is a better sample, and should run a bit faster
        revisedState = { ...revisedState, allCachedCampaignXDicts, allCachedCampaignXOwnerPhotos, allCachedCampaignXOwners,
          allCachedCampaignXPoliticianLists, allCachedCampaignXWeVoteIdsBySEOFriendlyPath, allCachedPoliticianWeVoteIdsByCampaignX,
          allCachedRecommendedCampaignXWeVoteIdLists, voterCanSendUpdatesCampaignXWeVoteIds, voterOwnedCampaignXWeVoteIds,
        };
        */
        revisedState = { ...revisedState, allCachedCampaignXDicts };
        revisedState = { ...revisedState, allCachedCampaignXOwnerPhotos };
        revisedState = { ...revisedState, allCachedCampaignXOwners };
        revisedState = { ...revisedState, allCachedCampaignXPoliticianLists };
        revisedState = { ...revisedState, allCachedCampaignXWeVoteIdsBySEOFriendlyPath };
        revisedState = { ...revisedState, allCachedPoliticianWeVoteIdsByCampaignX };
        revisedState = { ...revisedState, allCachedRecommendedCampaignXWeVoteIdLists };
        revisedState = { ...revisedState, voterCanSendUpdatesCampaignXWeVoteIds };
        revisedState = { ...revisedState, voterOwnedCampaignXWeVoteIds };
        return revisedState;

      case 'campaignLocalAttributesUpdate':
        // console.log('CampaignStore campaignLocalAttributesUpdate: ', action.payload);
        if (action.payload === undefined) {
          return state;
        } else {
          const campaignXWeVoteId = action.payload.campaignXWeVoteId || '';
          if (campaignXWeVoteId in allCachedCampaignXDicts) {
            campaignX = this.getCampaignXByWeVoteId(campaignXWeVoteId);
            if (action.payload.opposers_count) {
              campaignX.opposers_count = action.payload.opposers_count;
            }
            if (action.payload.supporters_count) {
              campaignX.supporters_count = action.payload.supporters_count;
            }
            allCachedCampaignXDicts[campaignXWeVoteId] = campaignX;
            return {
              ...state,
              allCachedCampaignXDicts,
            };
          } else {
            return state;
          }
        }

      case 'campaignNewsItemSave':
        // console.log('CampaignNewsItemStore campaignNewsItemSave');
        if (action.res.campaignx_we_vote_id && action.res.success) {
          campaignXNewsItem = action.res;
          allCachedCampaignXNewsItems[campaignXNewsItem.campaignx_news_item_we_vote_id] = campaignXNewsItem;
          campaignXNewsItemWeVoteIds = allCachedNewsItemWeVoteIdsByCampaignX[campaignXNewsItem.campaignx_we_vote_id] || [];
          if (campaignXNewsItemWeVoteIds && !campaignXNewsItemWeVoteIds.includes(campaignXNewsItem.campaignx_news_item_we_vote_id)) {
            campaignXNewsItemWeVoteIds.unshift(campaignXNewsItem.campaignx_news_item_we_vote_id);
            allCachedNewsItemWeVoteIdsByCampaignX[campaignXNewsItem.campaignx_we_vote_id] = campaignXNewsItemWeVoteIds;
          }
        }
        return {
          ...state,
          allCachedCampaignXNewsItems,
          allCachedNewsItemWeVoteIdsByCampaignX,
        };

      case 'campaignRetrieve':
      case 'campaignRetrieveAsOwner':
      case 'campaignStartSave':
        // See CampaignSupporterStore for code to take in the following campaignX values:
        // - latest_campaignx_supporter_endorsement_list
        // - latest_campaignx_supporter_list
        // - voter_campaignx_supporter

        if (!action.res || !action.res.success) return state;
        revisedState = state;
        campaignX = action.res;
        // console.log('CampaignStore campaignRetrieve, campaignX:', campaignX);
        if (allCachedCampaignXDicts === undefined) {
          allCachedCampaignXDicts = {};
        }
        allCachedCampaignXDicts[campaignX.campaignx_we_vote_id] = campaignX;
        if ('campaignx_news_item_list' in campaignX) {
          campaignXNewsItemWeVoteIds = [];
          for (let i = 0; i < campaignX.campaignx_news_item_list.length; ++i) {
            campaignXNewsItem = campaignX.campaignx_news_item_list[i];
            allCachedCampaignXNewsItems[campaignXNewsItem.campaignx_news_item_we_vote_id] = campaignXNewsItem;
            campaignXNewsItemWeVoteIds.push(campaignXNewsItem.campaignx_news_item_we_vote_id);
          }
          if (campaignX.campaignx_news_item_list.length > 0) {
            allCachedNewsItemWeVoteIdsByCampaignX[campaignXNewsItem.campaignx_we_vote_id] = campaignXNewsItemWeVoteIds;
          }
        }
        // if ('campaignx_owner_list' in campaignX) {
        ({
          allCachedCampaignXOwners,
          allCachedCampaignXOwnerPhotos,
          voterCanSendUpdatesCampaignXWeVoteIds,
          voterOwnedCampaignXWeVoteIds,
        } = this.extractCampaignXOwnerList(campaignX, allCachedCampaignXOwners, allCachedCampaignXOwnerPhotos, voterCanSendUpdatesCampaignXWeVoteIds, voterOwnedCampaignXWeVoteIds));
        // }
        if ('campaignx_politician_list' in campaignX) {
          ({ allCachedCampaignXPoliticianLists } = this.extractCampaignXPoliticianList(campaignX, allCachedCampaignXPoliticianLists));
          ({ allCachedPoliticianWeVoteIdsByCampaignX } = this.extractPoliticianWeVoteIdListFromCampaign(campaignX, allCachedPoliticianWeVoteIdsByCampaignX));
        }
        if (!(campaignX.seo_friendly_path in allCachedCampaignXWeVoteIdsBySEOFriendlyPath)) {
          allCachedCampaignXWeVoteIdsBySEOFriendlyPath[campaignX.seo_friendly_path] = campaignX.campaignx_we_vote_id;
        }
        // console.log('CampaignStore allCachedCampaignXOwners:', allCachedCampaignXOwners);
        if ('seo_friendly_path_list' in campaignX) {
          //
          let onePath = '';
          for (let i = 0; i < campaignX.seo_friendly_path_list.length; ++i) {
            onePath = campaignX.seo_friendly_path_list[i];
            if (onePath && onePath !== '') {
              if (!(onePath in allCachedCampaignXWeVoteIdsBySEOFriendlyPath)) {
                allCachedCampaignXWeVoteIdsBySEOFriendlyPath[onePath] = campaignX.campaignx_we_vote_id;
              }
            }
          }
        }
        if (action.res.voter_can_vote_for_politician_we_vote_ids) {
          // We want to reset this variable with this incoming value
          voterCanVoteForPoliticianWeVoteIds = action.res.voter_can_vote_for_politician_we_vote_ids;
          revisedState = { ...revisedState, voterCanVoteForPoliticianWeVoteIds };
        }
        if ('voter_campaignx_supporter' in action.res) {
          if ('campaign_supported' in action.res.voter_campaignx_supporter) {
            //
            // console.log('action.res.voter_campaignx_supporter.campaign_supported:', action.res.voter_campaignx_supporter.campaign_supported);
            if (action.res.voter_campaignx_supporter.campaign_supported) {
              if (!(action.res.voter_campaignx_supporter.campaignx_we_vote_id in voterSupportedCampaignXWeVoteIds)) {
                voterSupportedCampaignXWeVoteIds.push(action.res.voter_campaignx_supporter.campaignx_we_vote_id);
                revisedState = { ...revisedState, voterSupportedCampaignXWeVoteIds };
              }
            }
          }
        }
        revisedState = { ...revisedState, allCachedCampaignXDicts };
        revisedState = { ...revisedState, allCachedCampaignXNewsItems };
        revisedState = { ...revisedState, allCachedCampaignXOwners };
        revisedState = { ...revisedState, allCachedCampaignXOwnerPhotos };
        revisedState = { ...revisedState, allCachedCampaignXPoliticianLists };
        revisedState = { ...revisedState, allCachedCampaignXWeVoteIdsBySEOFriendlyPath };
        revisedState = { ...revisedState, allCachedNewsItemWeVoteIdsByCampaignX };
        revisedState = { ...revisedState, allCachedPoliticianWeVoteIdsByCampaignX };
        revisedState = { ...revisedState, voterCanSendUpdatesCampaignXWeVoteIds };
        revisedState = { ...revisedState, voterOwnedCampaignXWeVoteIds };
        return revisedState;

      case 'candidatesQuery':
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        // console.log('CampaignStore candidatesQuery');
        if (allCachedCampaignXDicts === undefined) {
          allCachedCampaignXDicts = {};
        }
        if (action.type === 'candidatesQuery') {
          candidateList = action.res.candidates;
        } else {
          candidateList = action.res.candidate_list;
        }
        // console.log('CandidateStore candidatesRetrieve contestOfficeWeVoteId:', contestOfficeWeVoteId, ', candidateList:', candidateList);
        candidateList.forEach((candidateDict) => {
          if (candidateDict.linked_campaignx_we_vote_id) {
            if (!(candidateDict.linked_campaignx_we_vote_id in allCachedCampaignXDicts)) {
              allCachedCampaignXDicts[candidateDict.linked_campaignx_we_vote_id] = generateCampaignXDictFromCandidateDict(candidateDict);
            }
          }
        });
        revisedState = { ...revisedState, allCachedCampaignXDicts };
        return revisedState;

      case 'politicianRetrieve':
        // For the candidate-related data attached to the Politician, create a pseudo-CampaignX object
        //  which is needed for objects like HeartFavoriteToggle
        candidateList = action.res.candidate_list;
        // //////////////////////////////
        // Process information about the opponents of this politician
        opponentCandidateList = action.res.opponent_candidate_list;
        if (opponentCandidateList) {
          opponentCandidateList.forEach((one) => {
            // console.log('CampaignStore: Opponent Candidate:', one);
            if (one && one.linked_campaignx_we_vote_id) {
              // Only store a value if there isn't already a campaignX record for this linked_campaignx_we_vote_id
              if (!(one.linked_campaignx_we_vote_id in allCachedCampaignXDicts)) {
                campaignX = this.createCampaignXFromCandidate(one);
                if (campaignX && campaignX.campaignx_we_vote_id) {
                  allCachedCampaignXDicts[one.linked_campaignx_we_vote_id] = campaignX;
                }
              }
            }
          });
        }
        // //////////////////////////////
        // Now Capture the politician's information
        // TODO this.createCampaignXFromPolitician(politician);

        return {
          ...state,
          allCachedCampaignXDicts,
        };

      case 'voterBallotItemsRetrieve':
        // For the candidate-related data coming in, create a pseudo-CampaignX object
        //  which is needed for objects like HeartFavoriteToggle
        if (!action.res || !action.res.ballot_item_list) return state;

        action.res.ballot_item_list.forEach((ballotItem) => {
          // console.log('CampaignStore, voterBallotItemsRetrieve: Ballot Item:', ballotItem);
          if (ballotItem && ballotItem.candidate_list) {
            ballotItem.candidate_list.forEach((candidate) => {
              if (candidate && candidate.linked_campaignx_we_vote_id) {
                // Only store a value if there isn't already a campaignX record for this linked_campaignx_we_vote_id
                if (!(candidate.linked_campaignx_we_vote_id in allCachedCampaignXDicts)) {
                  campaignX = this.createCampaignXFromCandidate(candidate);
                  if (campaignX && campaignX.campaignx_we_vote_id) {
                    allCachedCampaignXDicts[candidate.linked_campaignx_we_vote_id] = campaignX;
                  }
                }
              }
            });
          }
        });

        return {
          ...state,
          allCachedCampaignXDicts,
        };

      case 'voterSignOut':
        // console.log('CampaignStore voterSignOut, state:', state);
        revisedState = state;
        voterSpecificData = this.resetVoterSpecificData();
        revisedState = { ...revisedState, voterSpecificData };
        return revisedState;

      default:
        return state;
    }
  }
}

export default new CampaignStore(Dispatcher);
